---
published: false
layout: post
date: '2017-09-06 16:55:40 -0400'
tags:
  - machine-learning
  - deep-learning
  - server
  - ubuntu
  - linux
  - python
  - r
comments: true
---
## Setting up a Deep Learning server

Recently, I started a machine learning course and soon enough, I realized that I'd need a system more powerful than my 2012 Macbook Pro to train models. So I started building a PC. Nothing amazing, just a mid-range PC with decent specs to get me started.

->>> Insert Pic

Then I realized, I don't want to sit in front of this computer in my room! I want to still be able to do  execute code from a coffee shop down the street, or check its progress from work (shhhh!). Now, having done my fair share of "remoting" in, I know it becomes really laggy when you try to use a GUI over the internet through VNC, Remote Desktop, or Team Viewer. Essentially, I wanted to be able to use R Studio and Spyder from my Mac and execute the code on this computer.

# Setting up R Studio Server

Setting up R Studio Server was the easiest thing in all of this.

`sudo apt-get install r-studio-server`

# Setting up Anaconda

# Setting up IPython/Spyder Kernel

# Getting them both to start at boot

# Mounting the remote folder as a volume

## SSHFS

## Samba

# Securing the remote server

## ssh config

# Issues

1. Spyder kernel is different from IPython Kernel
2. Accessing your computer without the port forwarding mess

# Did it work?

# Making it effortless (or close enough)
