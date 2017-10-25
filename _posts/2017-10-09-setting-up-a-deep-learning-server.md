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

# Installing Tensorflow, Nvidia drivers, CUDA, cuDNN

->>> Link to a good article for this, no need to repeat

# Setting up R Studio Server

Setting up R Studio Server was the easiest thing in all of this.

`sudo apt-get install r-studio-server`

# Setting up Anaconda

->>> Insert install commands

# Setting up IPython/Spyder Kernel

->>> Insert commands to launch a remote Spyder kernel. Steps to access
->>> the remote kernel from local machine

->>> Comments about starting Spyder Kernel at boot, might not be a good idea

# Mounting the remote folder as a volume

->>> Words about why you'd want this

## SSHFS

->>> Commands, mount and unmount

## Samba

->>> Commands, mount and unmount

# Securing the remote server

->>> Link to securing ssh

# Making it look good

->>> byobu
->>> scripts and tricks to make it less of a chore everytime

1. Open Spyder on local machine
2. Open Remote byobu session
3. Run start_spyder_kernel.sh
4. Connect to kernel from local Spyder IDE
5. R Studio is simple, just go to the url in the browser!

# Issues

1. Spyder kernel is different from IPython Kernel
2. Accessing your computer without the port forwarding mess
