---
published: false
layout: post
date: '2018-04-20 20:11:40 -0400'
tags:
  - android
  - roboguice
  - dagger
color: '#68B257'
comments: true
---
# Switching from RoboGuice to Dagger 2

Recently, we decided that we wanted to let go of a deprecated, unmaintained RoboGuice and move to Dagger 2. There were two main reasons for this:

- Better performance, since Dagger doesn't use runtime reflection,
- Method count, since RoboGuice adds about 10,000 methods

## Import ButterKnife and Dagger 2

First things first, I removed RoboGuice from build.gradle and added ButterKnife and Dagger 2.12

> build.gradle
> ```groovy
>     implementation "com.google.dagger:dagger:2.12"
>     annotationProcessor "com.google.dagger:dagger-compiler:2.12"
>     
>     implementation "com.jakewharton:butterknife:8.8.1"
>     annotationProcessor "com.jakewharton:butterknife-compiler:8.8.1"
> ```

## @InjectView

First things first, remove RoboGuice from build.gradle and add ButterKnife! Okay, so that wasn't very obvious but we used RoboGuice's InjectView a lot, so we had to do something about that. It was pretty simple. Three steps: 

- Use "Replace in Path" to replace all instances of `@InjectView` with `@BindView`
- A simple regexp to remove `private` from all those fields since ButterKnife doesn't allow private fields
- Replace `import roboguice.inject.InjectView;` with `import butterknife.BindView;`

## Google annotations to javax annotations

Again, simple stuff, just a matter of replacing the imports. Replace in Path, find `import com.google.inject.` and replace with `import javax.inject.`.

## Here comes the grunt work

Now lets build our object graph. With RoboGuice, we had an `AppModule.java` file that extended `AbstractModule` and overrode its `configure()` method. In it, we bound each interface with it's implementation depending on the flags set in the app. This isn't how Dagger does it so I made two new files:

- AppModule
- AppComponent

In the AppModule, I first wrote a constructor that took Context, so that I can provide that to all classes that depend on it.

> AppModule.java
> ```java
> @Module
> public class AppModule {
>    private Context appContext;
>
>    public AppModule(Context context) {
>        this.appContext = context.getApplicationContext();
>    }
>
>    @Provides
>    Context context() {
>        return appContext;
>    }
>```

Here's how we provide an instance of a hypothetical `ApiService` implementation, which depends on a `PreferenceHelper` class.

> AppModule.java
> ```java
>
>    @Provides
>    ApiService apiService(ApiServiceImpl impl) {
>    	return impl;
>    }
>```

Turns out that this is the right way to use Dagger to provide an implementation. Where's the constructor call? In the generated code! Here's the class definition for ApiService.

> ApiService.java    
> ```java
> public abstract class LoginService {
>
> 	public ApiService(PreferenceHelper preferenceHelper) {
>		this.preferenceHelper = preferenceHelper;
>	}
> }
>```








