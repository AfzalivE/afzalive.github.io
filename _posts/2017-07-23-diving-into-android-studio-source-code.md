---
layout: post
title: Diving into Android Studio source code
date: '2017-07-23 04:11:40 -0400'
tags:
  - android
  - android-studio
published: true
---
It all began with me being annoyed enough at a bug to think “I should do something more than just file another issue,” and so I cloned the Android Studio code, using instructions from [http://tools.android.com/build/studio](http://tools.android.com/build/studio).

## Cloning the repo

To check out the latest of Android Studio, simply type in these commands.

```sh
$ mkdir studio-master-dev
$ cd studio-master-dev
$ repo init -u https://android.googlesource.com/platform/manifest -b studio-master-dev
$ repo sync
```


## The setup

I wanted to troubleshoot an issue in the Preview panel so I had to build Android Studio. To do this, you open the `tools/idea` folder in IDEA. The IDE will take its sweet time indexing and setting up the project, it took 7 minutes for me.

Now, building Android Studio is quite different from building an Android app. Thankfully, though, since Android tools are mostly Java and Groovy-based, we can use IntelliJ IDEA to build them.

Also, even though the guide says “use JDK 1.6”, I found that  ConstraintSolver code had Lambdas and some parts of the code used Diamonds, so obviously, we needed JDK 1.8 for some things. Thanks to [Nicolas Roard](https://medium.com/u/c006d5238349)’s  confirmation (ConstraintLayout team), “you should indeed use JDK 1.8.” So switch the Project SDK to JDK 1.8 and rename it to “IDEA jdk”.

Hit the Build button, you might come across some Kotlin errors about not being able to reassign a final `val`, I changed those to `var`. Build  again, and run, and finally, there’s that little Android Studio debug build that we were looking
for!

## The actual problem

The first issue we’re investigating today is, from what I recall, a recent regression. For a custom view that extends a layout and the `tools:parentTag` attribute `getChildAt(0)` is present in the merge layout XML, if you call  In the constructor, the preview panel complains that that element is a LinearLayout and it cannot be cast to, say, TextView. However, it works perfectly at runtime.

> _**Late edit:** I believe [this is the related issue](https://code.google.com/p/android/issues/detail?id=230604) in the tracker._
{:.lead}

## Reproducing the bug

Time to create a test project. Oh hold on, what’s that? The debug build doesn’t contain an embedded JDK, so Android Studio is unable to find one. Turns out, it’s an easy temporary fix. Just comment out lines 431–435 in IdeSdks.java. Run it again, and bam! Android Studio is able to find the external JDK and project opens up without an issue. Now, go to Module Settings (right-click module), and change the Project SDK to Android SDK. Re-open the project so Gradle can sync and everything is good in the world again. I hope we don’t have to do this every time we run a build, but we probably do.

> _**Note:** Great news, we don’t!_
{:.lead}

Back to the actual problem. Let’s create our custom view, TestView. Simple LinearLayout subclass.

```java
public class TestView extends LinearLayout {
    public TestView(Context context, AttributeSet attrs) {
        super(context, attrs);
        LayoutInflater.from(context).inflate(R.layout.view_test, this, true);

        TextView tv = (TextView) getChildAt(0);
        tv.setText("Hi");
    }
}
```

Inflate a merge XML layout in the constructor, with a TextView as the first child in the layout.

```xml
<?xml version="1.0" encoding="utf-8"?>
<merge xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:parentTag="LinearLayout">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hi"/>

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello"/>

</merge>
```

Alright, let’s build the project. Take a moment to appreciate that we’re building a project, inside an IDE that we just built, and then put this view in our `activity_main.xml`, and preview it.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:orientation="vertical"
    tools:context="com.afzaln.issueonetest.MainActivity">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!" />

    <com.afzaln.issueonetest.TestView
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</LinearLayout>
```

As expected, there’s the error. Let’s pull up the exception using “Show Exception” and see what we’re dealing with.

```java
java.lang.ClassCastException: android.widget.LinearLayout cannot be cast to android.widget.TextView
 at com.afzaln.issueonetest.TestView.<init>(TestView.java:19)
 at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
 at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
 at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
 at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
 at org.jetbrains.android.uipreview.ViewLoader.createNewInstance(ViewLoader.java:465)
 at org.jetbrains.android.uipreview.ViewLoader.loadClass(ViewLoader.java:172)
 at org.jetbrains.android.uipreview.ViewLoader.loadView(ViewLoader.java:105)
 at com.android.tools.idea.rendering.LayoutlibCallbackImpl.loadView(LayoutlibCallbackImpl.java:186)
 at android.view.BridgeInflater.loadCustomView(BridgeInflater.java:334)
 at android.view.BridgeInflater.loadCustomView(BridgeInflater.java:345)
 at android.view.BridgeInflater.createViewFromTag(BridgeInflater.java:245)
 at android.view.LayoutInflater.createViewFromTag(LayoutInflater.java:727)...
```

Looks exactly like I thought. The preview hierarchy suggests that LinearLayout is a child of our custom view, TestView, which is not the case in reality. So a workaround would be to just use `getChildAt(0).getChildAt(0)`. That, however, fails at runtime because that’s not the real hierarchy in the compiled app, also our “fixed” preview is slightly wrong, it’s using the merge tag’s orientation attribute. So what’s really happening?

What’s happening is that the `tools:parentTag` attribute is being used even in `activity_main.xml` when it should not be the case. If we remove this tag, preview works just as expected.

## Finding the culprit

Well, it seems like the fix is simple. If we’re inflating a custom view which is a child of the current view, don’t use the `tools:parentTag` attribute. Basically, only use that attribute when inflating the preview for merge layout XML.

In practice, this proved to be not so straight-forward. You see, what happens is that Android Studio this class called `RenderTask` to tell the `layoutlib` package how to inflate the
layout. This includes passing it a custom `LayoutLibCallback` instance which contains an implementation of an `ILayoutPullParser`. This implementation is obtained from the `LayoutPullParserFactory.create()` method, based on what type of resource we’re dealing with. Is it a Layout, Drawable, Menu, or raw XML?

In our case, it’s a Layout, so that means we get an instance of the `LayoutPsiPullParser` class, specifically the constructor at line 134. From here, we see that Android Studio calls the static *`createSnapshot()`* method so we follow it there. Here is the code which decides different tags in the XML layout. Going down this hole, we finally figure out the part where the IDE decides what to do with the `parentTag` attribute, in `LayoutPsiPullParser:683`, which is
the static *`createSnapshotForMerge()`* method.

This method basically says: If there’s a `tools:parentTag` attribute, create a “Synthetic tag” with for this XML tag, so that later on, `layoutlib` treats it as if it were the specified “parentTag” instead of the merge tag, and that is how we got the much-demanded parentTag feature, which is a very useful feature, might I add.

> _[The original issue asking for this feature](https://code.google.com/p/android/issues/detail?id=61652)_
{:.lead}

At this point, it doesn’t seem that simple to figure whether this XML tag is the root tag in the layout or if it’s coming from being included in another layout. Upon inspection of the `rootTag` object, it looks pretty identical in both cases.
However, I can obviously confirm that making the `parentTag` variable `null` gets rid of both, this whole issue, and the feature.

This post is already getting longer than I hoped, and most of it is about investigating the code instead of the actual bug fix, so bug fix will have to come in Part 2.
