---
layout: post
title: Intro to Jetpack Compose Navigation
date: '2020-10-14 10:10:40 -0400'
tags: android jetpack compose navigation ui
published: true
---

Last year, the Android team at Google announced Jetpack Compose. Since then, it has been seeing lots of updates; dev releases, and starting a few months ago, alpha releases with lots of great samples. Many of the sample apps [implemented](https://github.com/android/compose-samples/blob/1630f6b35ac9e25fb3cd3a64208d7c9afaaaedc5/Owl/app/src/main/java/com/example/owl/ui/utils/Navigation.kt) [their](https://github.com/android/compose-samples/blob/1630f6b35ac9e25fb3cd3a64208d7c9afaaaedc5/Jetsnack/app/src/main/java/com/example/jetsnack/ui/utils/Navigation.kt) own [Navigation](https://github.com/android/compose-samples/blob/1630f6b35ac9e25fb3cd3a64208d7c9afaaaedc5/JetNews/app/src/main/java/com/example/jetnews/ui/Navigation.kt) logic and many people wondered, what will be the official way to deal with navigation within Jetpack Compose, until now (or soon enough). The Jetpack Navigation library is about to reach its first release 🙌🏽

![GitHub screenshot of Jetpack Compose Navigation available for release commit](/assets/posts/2020/10/1-nav-compose-available-for-release.png){:.my-figure}

**Figure 1** - Jetpack Compose Navigation alpha release is coming soon!
{:.figcaption}

* this ordered seed list will be replaced by the toc
{:toc}

# Why should I use this?

Besides being the official solution, the Jetpack Navigation library uses the androidx navigation library. If you like the androidx navigation library, you'll probably feel some familiarity while using this. Of course, if your own implementation or some other library works for you, keep using it! These are all just tools to make development easier and we should use what we think is best for the job.

# Getting Started

How can you get your hands on this shiny piece of code and use it in your Jetpack Compose project?

From the [`androidx.dev`](http://androidx.dev) maven repository where the Android team releases snapshots!

1. In your root `build.gradle` file, add:

    ```groovy
allprojects {
     repositories {
       // .. existing repositories
       maven { url = 'https://androidx.dev/snapshots/builds/[buildId]/artifacts/ui/repository' }
     }
}
    ```

2. Replace `[buildId]` with the latest build ID from [https://androidx.dev/snapshots/builds](https://androidx.dev/snapshots/builds). This post uses `buildId = 6909004`.
3. In the `dependencies` block of your app's `build.gradle` file, add:

    ```groovy
implementation "androidx.navigation:navigation-compose:1.0.0-SNAPSHOT"
    ```

# Creating a simple Nav Graph

It's very simple to implement a simple hierarchical navigation where there is only one backstack and the whole application is within this backstack. Let's create two screens called `Profile` and `Dashboard` and add them to the NavGraph:

```kotlin
@Composable
fun SimpleNav() {
  NavHost(startDestination = "Profile") { // this: NavGraphBuilder
    composable("Profile") {
      Profile()
    }
    composable("Dashboard") {
      Dashboard()
    }
  }
}
```

You don't have to use a `String` for the Composable `id` inside the `NavGraphBuilder`. You can use any type.
{:.note}

We're using the `NavGraphBuilder` instance, provided by the `NavHost` Composable and the `composable` extension function to add destinations to the NavGraph.

## Navigating within the NavGraph

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

## The Result

[Simple Nav code on GitHub](https://github.com/AfzalivE/Fun-Compose/blob/main/app/src/main/java/com/afzaln/funcompose/navigation/simple/SimpleNav.kt)

<video id="figure-2" controls class="my-figure" preload="auto">
    <source src="/assets/posts/2020/10/simple-nav-config-changes-process-death.webm" type="video/webm">
    <source src="/assets/posts/2020/10/simple-nav-config-changes-process-death.mp4" type="video/mp4">
</video>

**Figure 2** - Simple navigation with config changes and process death
{:.figcaption}

## What about the backstack?

All of that is automatically handled already through the androidx Navigation library that this library uses. When your user presses the back button on the Dashboard screen, they're going to be taken to the Profile screen.

## Can I provide arguments for the destination?

Absolutely! Instead of calling `navigate("Dashboard")`, just pass a bundle of arguments like this:

```kotlin
navController.navigate("Dashboard", bundleOf("title" to "My Dashboard Title"))
```

Then, in our NavGraphBuilder, we can access these arguments through `backStackEntry` and pass them on to the Composable.

```kotlin
@Composable
fun SimpleNav() {
  NavHost(startDestination = "Profile") { // this: NavGraphBuilder
    // .. other composables
    composable("Dashboard") { backStackEntry ->
      Dashboard(
        title = backStackEntry.arguments?.get("title") as String
      )
    }
  }
}
```

**Figure 3** - NavArgs support coming soon!
{:.figcaption}


## Do I need to do anything to survive process death?

Not at all! As the [video](#figure-2) shows, process death support comes built-in and we don't need to do anything further for simple hierarchies. However, as we will see in the BottomNavigation example in [part 2]({% all_post_url 2020-10-15-multiple-navigation-graphs-with-jetpack-compose-navigation %}), there are some caveats when we need to manually save and restore the `NavHost` state.


# How can I update my TopAppBar title?

So if the `NavHostController` is only accessible to screens within the NavGraph, does this mean my TopAppBar and other common elements need to be replicated inside every screen?

**No.** Thankfully, we can provide our own instance of a `NavHostController` to the `NavHost` composable. Let's try that:

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
      }
    }
  )
}
```

Let's go through this line by line.

1. `rememberNavController()` is a way to quickly create a `NavHostController` that will survive configuration changes (🥳) and it uses a `ComposeNavigator`, which supports navigating through Composables.
2. `navController.currentBackStackEntryAsState()` allows us to observe the state of the current backstack entry, so when we use it to set the title of `TopAppBar`, it will automatically update when the current backstack entry changes. That's what this line does:

    `TopAppBar(title = { Text(currentScreen?.destination?.id.toString()) })`

3. Finally, we pass this our `NavHostController` to the `NavHost` Composable so it uses that instead of creating its own and voila!

<video controls class="my-figure" preload="auto">
    <source src="/assets/posts/2020/10/TopAppBar-nav-wrong-title.webm" type="video/webm">
    <source src="/assets/posts/2020/10/TopAppBar-nav-wrong-title.mp4" type="video/mp4">
</video>

**Figure 4** - Basic Navigation with TopAppBar but wrong title
{:.figcaption}

## Why is there a number in the TopAppBar?

That is because `currentScreen?.destination?.id.toString()` doesn't actually return the `destinationId` that we provide to `navController.navigate()`. Internally, the `navigate()` function uses the `hashCode` of that string + an initial ID of `0x00010000`.

We'll use this ID to determine which screen is being displayed, then use that to set the title. Let's define our screens now:

```kotlin
sealed class Screen(val title: String) {
  object Profile : Screen("Profile")
  object Dashboard : Screen("Dashboard")

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

## The Result

[Basic Nav with a TopAppBar code on GitHub](https://github.com/AfzalivE/Fun-Compose/blob/main/app/src/main/java/com/afzaln/funcompose/navigation/simple/TopBarNav.kt)

<video controls class="my-figure" preload="auto">
    <source src="/assets/posts/2020/10/TopAppBar-nav-dynamic-title.webm" type="video/webm">
    <source src="/assets/posts/2020/10/TopAppBar-nav-dynamic-title.mp4" type="video/mp4">
</video>

**Figure 5** - Basic Navigation with TopAppBar with the correct title
{:.figcaption}

# GitHub repository

All of the code discussed in this blog post is available here:

[https://github.com/AfzalivE/Fun-Compose](https://github.com/AfzalivE/Fun-Compose)

# Conclusion

I think Jetpack Navigation is going to simplify navigation code for a lot of people. Like all things in Compose, it is simple to use in most cases. In [part 2]({% all_post_url 2020-10-15-multiple-navigation-graphs-with-jetpack-compose-navigation %}), we're going to create multiple navigation graphs in a Bottom Navigation-based UI.
