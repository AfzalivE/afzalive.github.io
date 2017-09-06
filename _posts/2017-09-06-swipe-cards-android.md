---
published: false
---
## Swipe cards from scratch on Android

Recently, I wanted to build something that leveraged the stacked cards swiping paradigm that we've seen in Tinder and Google's own Primer app. Of course, there were quite a few libraries which tried to solve this problem very easily but I was curious about how I would go about implementing such a thing without those libraries.

## The CardView

Let's start by creating a CardView that reacts to the user's touch and allows the user to drag itself around the screen. To do this, we override the ```onTouchEvent(MotionEvent)``` method and get the MotionEvent action.

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

- ```ACTION_DOWN```, when the user initiates the drag
- ```ACTION_MOVE```, when user drags the view
- ```ACTION_UP```, when user terminates the drag


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

![swipecards-MainActivity-09062017160017.png](/_posts/images/2017-09-06/swipecards-MainActivity-09062017160017.png)



Now, on ```ACTION_DOWN```, we want to capture the initial touch coordinates relative to the top-left corner of our View. We will use these later to determine how much we should move the view while the user is dragging.

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

The real movement happens in ```ACTION_MOVE```, where we determine the new position of the view, following the user's touch. The simplest way to do it, is to use the ViewPropertyAnimator methods.

```java
    // ...
    @Override
    public boolean onTouchEvent(MotionEvent event) {
    // ...
        case MotionEvent.ACTION_UP:
            break;
        case MotionEvent.ACTION_MOVE:
            animate()
                .x(event.getRawX() + dx)
                .y(event.getRawY() + dy)
                .setDuration(0)
                .start();
            break;
    // ...
    }
```

Notice that we're using the ```dx, dy``` values we determined earlier. That's because we want the view to move from the point of user's touch. If we remove those, the view will attach its top-left corner to the touch point. Viola! Our view is draggable now.


### Rotation


### Snap it back

Another feature of the swipeable cards is that they snap back to their original position based on certain pre-requisites. Let's set those requirements right now:

- User is not dragging back towards the original position
- User drags more than 100px

For simplicity, we'll only focus on horizontal movement.
