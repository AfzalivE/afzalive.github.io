---
layout: post
title: Using the new Compose Navigation library
date: '2020-10-12 12:10:40 -0400'
tags: android jetpack compose ui
comments: true
published: false
---
# Using the new Compose Navigation library

Last year, the Android team at Google announced Jetpack Compose. Since then, it has been seeing lots of updates. Dev releases, and a few months ago, alpha releases with lots of great samples. Many of the sample apps [implemented](https://github.com/android/compose-samples/blob/1630f6b35ac9e25fb3cd3a64208d7c9afaaaedc5/Owl/app/src/main/java/com/example/owl/ui/utils/Navigation.kt) [their](https://github.com/android/compose-samples/blob/1630f6b35ac9e25fb3cd3a64208d7c9afaaaedc5/Jetsnack/app/src/main/java/com/example/jetsnack/ui/utils/Navigation.kt) own [Navigation](https://github.com/android/compose-samples/blob/1630f6b35ac9e25fb3cd3a64208d7c9afaaaedc5/JetNews/app/src/main/java/com/example/jetnews/ui/Navigation.kt) logic and many people wondered, what will be the official way to deal with navigation within Jetpack Compose, until now (or soon enough). The Jetpack Navigation library is about to reach its first release 🙌🏽

![Using%20the%20new%20Compose%20Navigation%20library%20ffa72ae8434c47d39d7377167a8c1874/Screen_Shot_2020-10-12_at_11.07.14_PM.png](Using%20the%20new%20Compose%20Navigation%20library%20ffa72ae8434c47d39d7377167a8c1874/Screen_Shot_2020-10-12_at_11.07.14_PM.png)

# Why should I use this?

Besides being the official solution, the Jetpack Navigation library uses the androidx navigation library. If you like the androidx navigation library, you'll probably feel some familiarity while using this. Of course, if your own implementation or some other library works for you, keep using it! These are all just tools to make development easier and we should use what we think is best for the job.

# Getting Started

How can you get your hands on this shiny piece of code and use it in your Jetpack Compose project?

1. From the [`androidx.dev`](http://androidx.dev) maven repository where the Android team releases snapshots!
2. In your root `build.gradle` file, add:

    ```kotlin
    allprojects {
      repositories {
        // .. existing repositories
        maven { url = 'https://androidx.dev/snapshots/builds/[buildId]/artifacts/ui/repository' }
      }
    }
    ```

3. Replace `[buildid]` with the latest build ID from [https://androidx.dev/snapshots/builds](https://androidx.dev/snapshots/builds)
4. In the `depedencies` block of your app's `build.gradle` file, add:

    ```kotlin
    implementation "androidx.compose.navigation:navigation:1.0.0-SNAPSHOT"
    ```

# Creating a simple Nav Graph

> Add gif showing the result

It's very simple to implement a simple hierarchical navigation where there is only one backstack and the whole application is within this backstack. Let's create three screens called and add them to the NavGraph:

```kotlin
@Composable
fun VeryBasicNav() {
  NavHost(startDestination = "Profile") { // this: NavGraphBuilder
    composable("Profile") {
      Profile()
    }
    composable("Dashboard") {
      Dashboard()
    }
    composable("Scrollable") {
      Scrollable()
    }
  }
}
```

We're using the `NavGraphBuilder` instance, provided by the `NavHost` Composable and the `composable` extension function to add destinations to the NavGraph.

## Navigation within the NavGraph

All composables within the NavGraph can access the `NavHostController` through the `AmbientNavController` to navigate within the graph.

Let's add navigation from Profile → Dashboard using a Button:

```kotlin
@Composable
fun Profile() {
    val navController = AmbientNavController.current
    Column(modifier = Modifier.fillMaxSize().then(Modifier.padding(8.dp))) {
        Text(text = Screen.Profile.title)
        Button(
            onClick = { navController.navigate("Dashboard") },
        ) {
            Text("Open Dashboard")
        }
    }
}
```

### Wait, what about the backstack?

All of that is automatically handled already through the androidx Navigation library that this library uses. When your user presses the back button on the Dashboard screen, they're going to be taken to the Profile screen.

### Can I provide arguments for the destination?

Not yet but NavArgs support is coming very very soon!

![Using%20the%20new%20Compose%20Navigation%20library%20ffa72ae8434c47d39d7377167a8c1874/Screen_Shot_2020-10-13_at_12.36.48_AM.png](Using%20the%20new%20Compose%20Navigation%20library%20ffa72ae8434c47d39d7377167a8c1874/Screen_Shot_2020-10-13_at_12.36.48_AM.png)

[https://android-review.googlesource.com/c/platform/frameworks/support/+/1423769](https://android-review.googlesource.com/c/platform/frameworks/support/+/1423769)

### Do I need to do anything to survive process death?

Nope. Process death support comes built-in and we don't need to do anything further for simple hierarchies. However, as we will see in the BottomNavigation example later, there are some caveats when `Composable` containing the `NavHost` can be disposed without closing the app.

GitHub code link

# How will I update my TopAppBar title?

So if the `NavHostController` is only accessible to screens within the NavGraph, does this mean my TopAppBar and other common elements need to be replicated inside every screen?

**No.**

Thankfully, we can provide an instance of the `NavHostController` to the `NavGraph` composable. Let's try that:

```kotlin
@Composable
private fun FunComposeApp() {
  val navController = rememberNavController()
  val currentScreen by navController.currentBackStackEntryAsState()

  Scaffold(
    topBar = {
      TopAppBar(
	title = {
	  Text(currentScreen?.destination?.id.toString())
	}
      )
    },
    bodyContent = {
      NavHost(
        navController = navController,
	startDestination = "Profile"
      ) { // this: NavGraphBuilder
	composable("Profile") {
	  Profile()
	}
	composable("Dashboard") {
	  Dashboard()
	}
	composable("Scrollable") {
	  Scrollable()
	}
      }
    }
  )
}
```

Let's go through this line by line.

1. `rememberNavController()` is a way to quickly create a `NavHostController` that will survive configuration changes (🥳) and it uses a `ComposeNavigator`, which supports navigating through Composables.
2. `navController.currentBackStackEntryAsState()` allows us to observe the state of the current backstack entry, so when we use it to set the title of `TopAppBar`, it will automatically update when the current backstack entry changes. That's what this line does:

    `TopAppBar(title = { Text(currentScreen?.destination?.id.toString()) })`

3. And finally, we pass this our `NavHostController` to the `NavHost` Composable so it uses that instead of creating its own.

> Add gif showing the result

## Wait, why is there a weird number in my TopAppBar?

That is because `currentScreen?.destination?.id.toString()` doesn't actually return the `destinationId` that we provide to `navController.navigate()`. Internally, the `navigate()` function uses the `hashCode` of that string + an initial ID of `0x00010000`.

**Note:** I think part of the API will improve in the future.

We need to find out which screen it is from this ID and display the details we need. Let's define our screens now:

```kotlin
sealed class Screen(val title: String) {
  object Profile : Screen("Profile")
  object Dashboard : Screen("Dashboard")
  object Scrollable : Screen("Scrollable")

/**
 * hack to generate the same Destination ID that
 * the Compose Navigation lib generates
 **/
  val id: Int
    get() {
      return title.hashCode() + 0x00010000
    }
}

fun NavDestination.toScreen(): Screen {
    return when (id) {
        Screen.Profile.id -> Screen.Profile
        Screen.Dashboard.id -> Screen.Dashboard
        Screen.Scrollable.id -> Screen.Scrollable
        else -> Screen.Profile
    }
}
```

Now, let's get the screen title from the `NavDestination` by using this in our TopAppBar title instead:

```kotlin
TopAppBar(
  title = {
    Text(current?.destination?.toScreen()?.title ?: "")
  }
)
```

> Add gif showing the result

GitHub code link

# BottomNavigation

Let's explore a scenario where we use BottomNavigation in our app but we have one tab inside which we need hierarchical navigation. Google's Clock app does this for the Timer tab.

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

> Add gif showing the result

That looks good, right? Looks like there are a few issues though.

### Back button doesn't seem to work outside the Dashboard screen if we switch tabs from the DashboardDetail screen.

It seems that the back press gets intercepted by the `NavHostController` even if we leave the Composable containing the `NavHost`. I'm not sure why this is happening and it looks like a bug (I have to confirm this from someone before I file a bug though).

In the meantime, I have found that disabling the `NavHostController`'s OnBackPressed functionality in `onDispose` seems to fix this. When NavDashboard is created, this seems to reset.

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

### The backstack for Dashboard screen gets cleared when I select another tab

This is the default behaviour but it's easy to save and restore the backstack state. Let's create a `MutableState` to hold the navigation state and pass it to `NavDashboard`:

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

`NavHostController` provides us the `saveState()` and the `restoreState(Bundle)` functions to manually handle the state of the backstack. On every destination change, we save the state to  `navState` and every time `NavDashboard` gets recomposed, we restore its state from `navState`. That's why we keep it in `TabContent` so it survives even when `NavDashboard` is disposed.

### It's not surviving process death anymore!

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

The backstack state now persists across process death.

> gif of backstack surviving

**Note:** The currently selected screen in TabContent doesn't survive process death. The code on GitHub shows how to do this as well.

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

> gif showing result

link to github code

# Adding NavDestinations after NavGraph is built

It is possible that one might need to add destinations after the NavGraph is already built. It is possible, however, I'm not sure about the extent of support here. It is also entirely possible that this functionality is not needed at all but since I explored it, I'll just mention an issue I had with it.

In this example, I added the `PhraseDetail` destination when `Scrollable` screen was composed by passing it the `NavGraphBuilder` instance (from the `NavHost` builder function).

```kotlin
/**
 * An example of how to add a dynamic destination to
 * an existing NavGraph but doing this will
 */
@Composable
fun Scrollable(navGraphBuilder: NavGraphBuilder) {
    val navController = AmbientNavController.current
    Column(modifier = Modifier.fillMaxSize().then(Modifier.padding(8.dp))) {
        navController.graph.addDestination(
            ComposeNavigator.Destination(
                navGraphBuilder.provider[ComposeNavigator::class]
            ) {
                PhraseDetail()
            }.apply { id = Screen.PhraseDetail.id })

        LazyColumnFor(items = phrases) {
            ListItem(
                text = { Text(text = it) },
                modifier = Modifier.clickable(onClick = {
                    navController.navigate(Screen.PhraseDetail.title)
                })
            )
        }
    }
}
```

Since we have access to the `NavHostController` at this point, we can create destinations using the `ComposeNavigator` and add them to it. We also have to manually generate an ID for the destination.

There is one tiny issue with this: It seems that when we are relying on the built-in process restoration in the Jetpack Navigation library, this particular use case causes the app to crash because it cannot find the destination at the time of restore.

# GitHub repository

All of the code discussed in this blog post is available here:

[https://github.com/AfzalivE/Fun-Compose](https://github.com/AfzalivE/Fun-Compose)

# Conclusion

I think Jetpack Navigation is going to simplify navigation code for a lot of people. Like all things in Compose, it is simple to use in most cases. As it evolves, it will hopefully deal with some of the issues mentioned here. I'm really excited for Compose and how it shapes the future of Android development and the quality of apps that we will be able to create.
