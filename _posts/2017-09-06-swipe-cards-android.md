---
layout: post
title:  'Swipe cards on Android'
date:   2017-09-06 16:55:40 -0400
tags: [android, animations]
comments: true
published: false
---

Recently, I wanted to build something that leveraged the stacked cards swiping paradigm that we've seen in Tinder and Google's own Primer app. Of course, there were quite a few libraries which tried to solve this problem very easily but I was curious about how I would go about implementing such a thing without those libraries.

> Note: Some concepts in this post are taken from the [SwipeStack library](https://github.com/flschweiger/SwipeStack) by Frederik Schweiger

## The CardView

Let's start by creating a CardView that reacts to the user's touch and allows the user to drag itself around the screen. To do this, we override the `onTouchEvent(MotionEvent)` method and get the MotionEvent action.

```java
public class CardView extends View {

    public CardView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int action = event.getAction() & MotionEvent.ACTION_MASK;
        switch (action) {
            case MotionEvent.ACTION_DOWN:
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_MOVE:
                break;
            default:
                return false;
        }

        return true;
    }
}
```

There are three main actions we are interested in: 

- `ACTION_DOWN`, when the user initiates the drag
- `ACTION_MOVE`, when user drags the view
- `ACTION_UP`, when user terminates the drag


Let's also setup the layout XML so that this view is visible in our Activity.

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" 
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center">

    <com.afzaln.tindercards.CardView
        android:id="@+id/card_view"
        android:background="@color/colorAccent"
        android:layout_width="200dp"
        android:layout_height="200dp" />

</LinearLayout>
```

<br>

![swipecards-MainActivity-09062017160017.png](/assets/img/posts/2017-09-06/swipecards-MainActivity-09062017160017.png){:.center}

<br>

Now, on `ACTION_DOWN`, we want to capture the initial touch coordinates relative to the top-left corner of our View. We will use these later to determine how much we should move the view while the user is dragging.

```java
public class CardView extends View {
    private float dx;
    private float dy;

    // ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_DOWN:
            dx = getX() - event.getRawX();
            dy = getY() - event.getRawY();
            break;
    // ...
    }
```

The real movement happens in `ACTION_MOVE`, where we determine the new position of the view, following the user's touch. The simplest way to do it, is to use the ViewPropertyAnimator methods.

```java
    // ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_UP:
            break;
        case MotionEvent.ACTION_MOVE:
            float newX = event.getRawX() + dx;
            float newY = event.getRawY() + dy;

            animate()
                .x(newX)
                .y(newY)
                .setDuration(0)
                .start();
            break;
    // ...
    }
```

Notice that we're using the `dx, dy` values we determined earlier. That's because we want the view to move from the point of user's touch. If we remove those, the view will attach its top-left corner to the touch point. Viola! Our view is draggable now.

<br>

{% video /assets/img/posts/2017-09-06/swipecards-1.mp4 720 480 %}

### Rotation

Let's setup rotation now that translation is done. We can cap the maximum allowable rotation at 30 degrees, then determine how much we should rotate based on the distance, the card has travelled.

To determine this distance, all we need to do is subtract newX from the initial X position.

```java
    private float initialX;
    private float initialY;

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        initialX = getX();
        initialY = getY();
    }
```

We need to override `onLayout()` to get the initial X and Y values, since that's when they're set. We can get the distance now, but let's divide it by the screen width to get a progress of the swipe between -1 and 1. -1 to 0 means the movement is to the left of the original position, 0 to 1 means it's to the right. This way, we can simply scale down the rotation degrees according to the position of the card.

```java
    public static final int MAX_ROTATION = 30;

    // ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_MOVE:
            float newX = event.getRawX();
            float dragDistance = newX - initialX;
            int screenWidth = getResources().getDisplayMetrics().widthPixels;
            float progress = Math.min(Math.max(dragDistance / screenWidth, -1), 1);

            animate()
                .x(newX)
                .y(newY)
                .rotation(MAX_ROTATION * progress)
                .setDuration(0)
                .start();
            break;
    // ...
    }
```            

<br>

{% video /assets/img/posts/2017-09-06/swipecards-2.mp4 720 480 %}

### Snap it back

Another feature of the swipeable cards is that they snap back to their original position based on certain pre-requisites. For simplicity, we'll only focus on horizontal movement, it should be easy to do the same vertically if needed. Let's set those requirements right now:

- Drag progress is less than 0.3
- User is dragging back towards the original position

The first one is simple. When the user finishes the drag and lifts their finger up, we simply get the progress and see if it's greater than 0.3 or less than -0.3.

```java
    public static final double PROGRESS_THRESHOLD = 0.3;

    // ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_UP:
            float newX = event.getRawX() + dx;
            float dragDistance = newX - initialX;
            int screenWidth = getResources().getDisplayMetrics().widthPixels;
            float progress = Math.min(Math.max(dragDistance / screenWidth, -1), 1);

            if (progress > PROGRESS_THRESHOLD) {
                // TODO swipeRight();
                break;
            } else if (progress < -PROGRESS_THRESHOLD) {
                // TODO swipeLeft();
                break;
            }
            break;
    // ...
    }
```    

For the second one, we can keep track of the last progress value in `ACTION_MOVE`. That way, we can determine whether progress increased or decreased when the user lifted their finger.  