---
published: false
layout: post
date: '2018-04-20 20:11:40 -0400'
tags:
  - android
  - roboguice
  - dagger
color: '#68B257'
comments: true
---
# Switching from RoboGuice to Dagger 2

Recently, we decided that we wanted to let go of a deprecated, unmaintained RoboGuice and move to Dagger 2. There were two main reasons for this:

- Better performance, since Dagger doesn't use runtime reflection,
- Method count, since RoboGuice adds about 10,000 methods

## Import ButterKnife and Dagger 2

First things first, I removed RoboGuice from build.gradle and added ButterKnife and Dagger 2.12

> build.gradle
> ```groovy
>     implementation "com.google.dagger:dagger:2.12"
>     annotationProcessor "com.google.dagger:dagger-compiler:2.12"
>     
>     implementation "com.jakewharton:butterknife:8.8.1"
>     annotationProcessor "com.jakewharton:butterknife-compiler:8.8.1"
> ```

## @InjectView

First things first, remove RoboGuice from build.gradle and add ButterKnife! Okay, so that wasn't very obvious but we used RoboGuice's InjectView a lot, so we had to do something about that. It was pretty simple. Three steps: 

- Use "Replace in Path" to replace all instances of `@InjectView` with `@BindView`
- A simple regexp to remove `private` from all those fields since ButterKnife doesn't allow private fields
- Replace `import roboguice.inject.InjectView;` with `import butterknife.BindView;`

## Google inject to javax inject

