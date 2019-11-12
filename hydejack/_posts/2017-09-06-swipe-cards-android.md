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
            float newX = event.getRawX() + dx;
            float newY = event.getRawY() + dy;
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

### Determine the action

Now, we need to decide what constitutes as a succesful swipe, and also if it's a left swipe, a right swipe, or a cancel action. For simplicity, we'll only focus on horizontal movement, it should be easy to do the same vertically if needed. Let's set the requirements for a successful swipe:

- Drag progress is greater than 0.3
- User is dragging away from the original position

The first one is simple. When the user finishes the drag and lifts their finger up, we simply get the progress and see if it's greater than 0.3 or less than -0.3. Greater than 0.3 means a right swipe, less than -0.3 means a left swipe. Anything in the middle is a cancel action.

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

            // TODO resetPosition();
            break;
    // ...
    }
```    

For the second one, we can keep track of the last progress value in `ACTION_MOVE`. That way, we can determine whether progress increased or decreased when the user lifted their finger.

```java
    private float lastProgress;
    private boolean isSwipingAway;

// ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_MOVE: {
            float newX = event.getRawX() + dx;
            float newY = event.getRawY() + dy;
            float dragDistance = newX - initialX;
            int screenWidth = getResources().getDisplayMetrics().widthPixels;
            float progress = Math.min(Math.max(dragDistance / screenWidth, -1), 1);

            isSwipingAway = Math.abs(progress) > Math.abs(lastProgress);
            lastProgress = progress;

            animate()
                    .x(newX)
                    .y(newY)
                    .rotation(MAX_ROTATION * progress)
                    .setDuration(0)
                    .start();
            break;
        }
    // ...
```

Now, we can simply check `isSwipingAway` in `ACTION_UP`.

```java
    public static final double PROGRESS_THRESHOLD = 0.3;

    // ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_UP: {
            float newX = event.getRawX() + dx;
            float dragDistance = newX - initialX;
            int screenWidth = getResources().getDisplayMetrics().widthPixels;
            float progress = Math.min(Math.max(dragDistance / screenWidth, -1), 1);

            if (isSwipingAway) {
                if (progress > PROGRESS_THRESHOLD) {
                    // TODO swipeRight();
                    break;
                } else if (progress < -PROGRESS_THRESHOLD) {
                    // TODO swipeLeft();
                    break;
                }
            }

            // TODO resetPosition();
            break;
        }
    // ...
    }
```

Note that I put curly braces for the case statements, this is to limit the scope of the variables. Technically, you can declare them in `ACTION_UP` and reuse them in `ACTION_MOVE` but I just wanted to keep it cleaner. Actually, let's reset this `lastProgress` value just in case there's an edge case.

```java
    // ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_UP:
            dx = getX() - event.getRawX();
            dy = getY() - event.getRawY();
            lastProgress = 0;
            break;

```

### Implementing swipe and reset animations

Now, we've got the whole thing working...Except the card doesn't automatically move when the swipe is successful, nor does it go back to its original position when it's cancelled.

It's pretty straight-forward. For resetting the position, we use the `initialX, initialY` values and set the rotation to 0. For swiping, we just move it left or right outside of the screen.

```java
    private void resetPosition() {
        animate()
                .x(initialX)
                .y(initialY)
                .rotation(0)
                .setDuration(200)
                .setInterpolator(new AccelerateDecelerateInterpolator())
                .start();
    }

    private void swipeLeft() {
        int screenWidth = getResources().getDisplayMetrics().widthPixels;

        animate()
                .x(-screenWidth)
                .rotation(MAX_ROTATION)
                .alpha(0f)
                .setDuration(150);
    }

    private void swipeRight() {
        int screenWidth = getResources().getDisplayMetrics().widthPixels;

        animate()
                .x(screenWidth)
                .rotation(MAX_ROTATION)
                .alpha(0f)
                .setDuration(150);
    }
```

Uncomment the relevant lines in `ACTION_UP` and we're good to swipe this one card. However, this doesn't remove the view from the hierarhcy once we're done with it so let's take care of that.