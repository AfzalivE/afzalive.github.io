---
layout: post
title: Performance of realtime graphing libraries on Android
date: '2017-07-23 04:11:40 -0400'
tags:
  - android
  - graphs
  - charts
published: false
---
> “Which graphing library should I use?”
{:.lead}

I see this question pop up every now and then on [#android-dev on
Freenode](http://irc.lc/freenode/android-dev), which is where all the cool
Android developers hang out to procrastinate. Usually, people suggest using
PhilJay’s MPAndroidChart. There was a time I was trying to decide which one is
the best one for my use case so I tried GraphView, MPAndroidChart, and
HelloCharts, and for long-forgotten reasons, I decided to stick with the last
one.

I deal with realtime, time series data on a daily basis, since that’s what
motion sensors like to output. For me, it’s important that the graph isn’t
lagging behind the data, and that the rest of the app is still usable. The input
is fairly fast, usually 50Hz and above. A few weekends ago, I decided to settle this
debate with real numbers.

We’re going to benchmark the following 5 libraries:

* [AndroidPlot](https://github.com/halfhp/androidplot)
* [GraphView](https://github.com/jjoe64/GraphView)
* [HelloCharts](https://github.com/lecho/hellocharts-android)
* [MPAndroidChart](https://github.com/PhilJay/MPAndroidChart)
* [SciChart](https://www.scichart.com/android-chart-features/)

4 of these are open source and free. The remaining one, SciChart
is paid, for a $777! It's just here for curiosity’s sake. I won’t go into detail
about any of these since that’s not the purpose of this post.

Not included (but wish I could include in future):
* (Paid) [TeeChart](https://www.steema.com/product/java_android#overview)
* (Free) [WilliamChart](https://github.com/diogobernardino/WilliamChart)


#### Benchmark Criteria

I’m going to use a Google Pixel for this and we’re going to evaluate rendering frame
rates (FPS) and memory usage in 5 areas:

* Non-scrolling graph, one axis
* Non-scrolling graph, three axes
* Scrolling, FIFO graph, one axis
* Scrolling, FIFO graph, three axis
* Five graphs at one time, one axis each

What I mean by non-scrolling, is that the first point on the graph will remain
on the screen while the rest is being populated. FIFO (First in first out) means the points outside the screen will be removed from the data set.

All of these, will be populated at 100Hz, 1000Hz, 10000Hz, and 100000Hz.

### Results

### 100 Hz

### 1000 Hz

### 10000 Hz

### 100000 Hz
