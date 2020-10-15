---
layout: post
title: Multiple NavGraphs with Compose Navigation
date: '2020-10-14 10:10:40 -0400'
tags: android jetpack compose navigation ui
comments: true
published: true
---

In part 1, I wrote about [how to get started with the Jetpack Compose Navigation library]({% all_post_url 2020-10-15-intro-to-jetpack-compose-navigation %}). We discussed how to create a simple navigation graph and how to obtain information about the graph outside it. Now, let's explore how we can use multiple navigation graphs in a Bottom Navigation-driven UI.

* this ordered seed list will be replaced by the toc
{:toc}

# Setup instructions

For instructions on how to setup your project to import the Jetpack Compose Navigation library, please refer to [part 1]({% all_post_url 2020-10-15-intro-to-jetpack-compose-navigation %}) of this series.

# BottomNavigation

Let's explore a scenario where we use BottomNavigation in our app but we have one tab inside which we need hierarchical navigation. Google's Clock app does this for the Timer tab.

## Implementation

Let's create a Composable that shows a screen based on which tab is selected:

```kotlin
@Composable
fun TabContent(screen: Screen) {
  when (screen) {
    Screen.Profile -> Profile()
    Screen.Dashboard -> NavDashboard()
    Screen.Scrollable -> NoClickScrollable()
    else -> Profile()
  }
}

@Composable
fun NavDashboard() {
  val navController = rememberNavController()

  NavHost(
    navController = navController,
    startDestination = "Dashboard"
  ) {
    composable(Screen.Dashboard.title) {
        Dashboard()
    }
    composable(Screen.DashboardDetail.title) {
        Text("Some Dashboard detail")
    }
  }
}
```

We pass the selected screen to this Composable, it shows it. Our Dashboard screen has changed though. That's the screen we need navigation inside, `NavDashboard` just creates a `NavHost` and defines a NavGraph. `Dashboard` has also changed a little, now it contains a Button that navigates to `DashboardDetail` when clicked. We've also add it to the previously defined `Screen` sealed class.

<video controls id="figure-1" class="my-figure" preload="auto">
    <source src="/assets/posts/2020/10/bottom-nav-backpress-issue.webm" type="video/webm">
    <source src="/assets/posts/2020/10/bottom-nav-backpress-issue.mp4" type="video/mp4">
</video>

**Figure 1** - Bottom Navigation with back press issue
{:.figcaption}

That looks good, right? Looks like there are a few issues though.

## Back button doesn't seem to work properly

It seems that back button taps get intercepted by the `NavHostController` even if we leave the Composable containing the `NavHost` (i.e. the Dashboard Screen). I'm not sure why this is happening and it looks like a bug (I have to confirm this from someone before I file a bug though).

In the meantime, I have found that disabling the `NavHostController`'s OnBackPressed functionality in `onDispose` seems to fix this. When NavDashboard is recomposed, this resets back to true.

```kotlin
@Composable
fun NavDashboard() {
  // ... existing code

  onDispose {
    // workaround for issue where back press is intercepted
    // outside this tab, even after this Composable is disposed
    navController.enableOnBackPressed(false)
  }
}
```

Works properly now! Pressing the back button closes the app now instead of doing nothing.

<video controls class="my-figure" preload="auto">
    <source src="/assets/posts/2020/10/bottom-nav-backpress-issue-fixed.webm" type="video/webm">
    <source src="/assets/posts/2020/10/bottom-nav-backpress-issue-fixed.mp4" type="video/mp4">
</video>

**Figure 2** - Bottom Navigation with back press issue fixed
{:.figcaption}

##  Dashboard's backstack gets cleared on switching tabs

We can see in [figure 1](#figure-1) that Dashboard screen's backstack gets cleared when we switch tabs away from it. This is the default behaviour but it's easy to save and restore the backstack state. Let's create a `MutableState` to hold the navigation state and pass it to `NavDashboard`:

```kotlin
@Composable
fun TabContent(screen: Screen) {
  val navState = remember { mutableStateOf(Bundle()) }
  when (screen) {
    Screen.Dashboard -> NavDashboard(navState)
    // .. other screens
  }
}

@Composable
fun NavDashboard(navState: MutableState<Bundle>) {
  val navController = rememberNavController()
  navController.addOnDestinationChangedListener { navController, _, _ ->
    navState.value = navController.saveState() ?: Bundle()
  }
  navController.restoreState(navState.value)

  // .. NavHost stuff
}
```

`NavHostController` provides us the `saveState()` and the `restoreState(Bundle)` functions to manually handle the state of the backstack. On every destination change, we save the state to  `navState` and every time `NavDashboard` gets recomposed, we restore its state from `navState`. We keep this `navState` in `TabContent` so it survives even when `NavDashboard` is disposed.

Okay, this is working now. We're able to keep Dashboard screen's backstack, even as we switch away and return to it!

<video controls class="my-figure" preload="auto">
    <source src="/assets/posts/2020/10/bottom-nav-backstack-issue-fixed.webm" type="video/webm">
    <source src="/assets/posts/2020/10/bottom-nav-backstack-issue-fixed.mp4" type="video/mp4">
</video>

**Figure 3** - Bottom Navigation with backstack restoration
{:.figcaption}

## It's not surviving process death anymore!

One downside of manually handling the backstack state is that we lose NavHostController's built-in ability to survive process death. Let's add this ability back:

```kotlin
@Composable
fun TabContent(screen: Screen) {
  val navState = rememberSavedInstanceState(saver = NavStateSaver()) { mutableStateOf(Bundle()) }
  // .. show screen
}

fun NavStateSaver(): Saver<MutableState<Bundle>, out Any> = Saver(
  save = { it.value },
  restore = { mutableStateOf(it) }
)
```

`rememberSavedInstanceState` allows us to persist and restore mutable data beyond process death. It uses a `Saver` object to handle the save and restore operations. Since our `navState` is just a `MutableState<Bundle>`, for saving, we just get the `value: Bundle` from it. For restoring, we recreate the `MutableState` object from that `Bundle`.

The backstack state will now persist across process death.

The currently selected screen in TabContent doesn't survive process death. The code on GitHub shows how to do this as well.
{:.note}

[Link to GitHub code for Bottom Navigation example](https://github.com/AfzalivE/Fun-Compose/tree/3-bottom-nav-single-nav-graph)

## Multiple NavGraphs within BottomNavigation

What if we want to keep multiple backstacks, within multiple tabs? Actually, it's not very different from keeping one NavGraph. Let's convert the `Scrollable` screen to have its own backstack. It will navigate to a new screen called `PhraseDetail`.

```kotlin
@Composable
fun TabContent(screen: Screen) {
  val dashboardNavState = rememberSavedInstanceState(saver = NavStateSaver()) { mutableStateOf(Bundle()) }
  val scrollableNavState = rememberSavedInstanceState(saver = NavStateSaver()) { mutableStateOf(Bundle()) }
  when (screen) {
    Screen.Dashboard -> NavDashboard(dashboardNavState)
    Screen.Scrollable -> NavScrollable(scrollableNavState)
    // .. other screens
  }
}

@Composable
fun NavScrollable(navState: MutableState<Bundle>) {
  val navController = rememberNavController()
  navController.addOnDestinationChangedListener { navController, _, _ ->
    navState.value = navController.saveState() ?: Bundle()
  }
  navController.restoreState(navState.value)

  NavHost(
    navController = navController,
    startDestination = "Scrollable"
  ) {
    composable("Scrollable") {
        Scrollable(this)
    }
    composable("PhraseDetail") {
        PhraseDetail()
    }
  }

  onDispose {
    // workaround for issue where back press is intercepted
    // outside this tab, even after this Composable is disposed
    navController.enableOnBackPressed(false)
  }
}
```

`NavScrollable` ends up looking very similar to `NavDashboard`. At this point, we could probably create a `RestorableNavHost` that just contains this functionality, takes a `MutableState<Bundle>` and a `NavGraphBuilder` function.

## The Result

<video controls class="my-figure" preload="auto">
    <source src="/assets/posts/2020/10/bottom-nav-multiple-nav-graphs.webm" type="video/webm">
    <source src="/assets/posts/2020/10/bottom-nav-multiple-nav-graphs.mp4" type="video/mp4">
</video>

**Figure 4** - Bottom Navigation with multiple Nav Graphs
{:.figcaption}

# GitHub repository

All of the code discussed in this blog post is available here:

[https://github.com/AfzalivE/Fun-Compose/tree/4-bottom-nav-multiple-nav-graph](https://github.com/AfzalivE/Fun-Compose/tree/4-bottom-nav-multiple-nav-graph)

# Conclusion

While it was still relatively simple to achieve this, there were a few things we had to be careful of. Since this is pre-alpha/alpha stage, I'm sure some (if not all) of the issues mentioned here will be addressed by the time this is production ready. I'm really excited for Compose and how it shapes the future of Android development and the quality of apps that we will be able to create.
