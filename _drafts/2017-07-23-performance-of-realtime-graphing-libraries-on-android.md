---
published: false
layout: post
title: Performance of realtime graphing libraries on Android
date: '2017-07-23 04:11:40 -0400'
categories: Android Graphs Charts
---
> “Which graphing library should I use?”
{:.lead}

I see this question pop up every now and then on [#android-dev on
Freenode](http://irc.lc/freenode/android-dev), which is where all the cool
Android developers hang out to procrastinate. Usually, people suggest using
PhilJay’s MPAndroidChart. There was a time I was trying to decide which one is
the best one for my use case so I tried GraphView, MPAndroidChart, and
HelloCharts, and for long forgotten reasons, I decided to stick with the last
one.

I deal with realtime, time series data on a daily basis, since that’s what
motion sensors like to output. For me, it’s important that the graph isn’t
lagging behind the data, and that the rest of the app is still usable. The input
is fairly fast, usually 50Hz and above. This weekend, I decided to settle this
debate with real numbers.

We’re going to benchmark the following 7 libraries:

* [AndroidPlot](https://github.com/halfhp/androidplot)
* [GraphView](https://github.com/jjoe64/GraphView)
* [HelloCharts](https://github.com/lecho/hellocharts-android)
* [MPAndroidChart](https://github.com/PhilJay/MPAndroidChart)
* [SciChart](https://www.scichart.com/android-chart-features/)
* [TeeChart](https://www.steema.com/product/java_android#overview)
* [WilliamChart](https://github.com/diogobernardino/WilliamChart)

5 of these are open source and free. The remaining two, SciChart and TeeChart
are paid. These two are just here for curiosity’s sake. I won’t go into detail
about any of these since that’s not the purpose of this post.

#### Benchmark Criteria

I’m going to use a Nexus 5X for this and we’re going to evaluate rendering frame
rates (FPS), and memory usage in 6 areas:

* Non-scrolling graph, one axis
* Non-scrolling graph, three axes
* Scrolling graph, one axis
* Scrolling graph, three axis
* Scrolling, FIFO graph, one axis
* Scrolling, FIFO graph, three axis
* Five graphs at one time, one axis each

What I mean by non-scrolling, is that the first point on the graph will remain
on the screen while the rest is being populated. Scrolling, means the screen
will display a finite number of points and the ones before will be scrolled off,
but not removed from the data set, so you can scroll to them later when the
graph is not being populated. FIFO (First in first out) means the points outside
the screen will be removed from the data set.

All of these, will be populated at 100Hz, 1000Hz, 10,000Hz, and 100,000Hz.

### Results

