---
published: true
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

* Better performance, since Dagger doesn't use runtime reflection,
* Method count, since RoboGuice adds about 10,000 methods

## Import ButterKnife and Dagger 2

First things first, I removed RoboGuice from build.gradle and added ButterKnife and Dagger 2.12

> build.gradle
>
> ```groovy
>     implementation "com.google.dagger:dagger:2.12"
>     annotationProcessor "com.google.dagger:dagger-compiler:2.12"
>
>     implementation "com.jakewharton:butterknife:8.8.1"
>     annotationProcessor "com.jakewharton:butterknife-compiler:8.8.1"
> ```

## @InjectView

We used RoboGuice's InjectView a lot, so we had to do something about that, we decided to go with ButterKnife. It was pretty simple. Three steps:

* Use "Replace in Path" to replace all instances of `@InjectView` with `@BindView`
* A simple regexp to remove `private` from all those fields since ButterKnife doesn't allow private fields
* Replace `import roboguice.inject.InjectView;` with `import butterknife.BindView;`
* In every Activity and Fragment, call `ButterKnife.bind(this)` (in `onCreate`) or `ButterKnife.bind(this, view)` (in `onCreateView`)
* Remove all RoboGuice injector calls in those classes.

## Google annotations to javax annotations

Again, simple stuff, just a matter of replacing the imports. Replace in Path, find `import com.google.inject.` and replace with `import javax.inject.`

## The grunt work

Now lets build our object graph. With RoboGuice, we had an `AppModule.java` file that extended `AbstractModule` and overrode its `configure()` method. In it, we bound each interface with it's implementation depending on the flags set in the app. This isn't how Dagger does it so I made two new files:

* AppModule
* AppComponent

In the AppModule, I first wrote a constructor that took Context, so that I can provide that to all classes that depend on it.

> AppModule.java
>
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
> ```

Here's how we provide an instance of a hypothetical `ApiService` implementation, which depends on a `PreferenceHelper` class.

> AppModule.java
>
> ```java
>    @Provides
>    ApiService apiService(ApiServiceImpl impl) {
>    	return impl;
>    }
> ```

Turns out that this is the right way to use Dagger to provide an implementation. Where's the constructor call? In the generated code! Here's the class definition for ApiService.

> ApiService.java
>
> ```java
> public abstract class ApiService {
>
>     public ApiService(PreferenceHelper preferenceHelper) {
>         this.preferenceHelper = preferenceHelper;
>     }
> }
> ```

There's no `@Inject` on this constructor since this is an abstract class. This is `ApiServiceImpl`. This is where the magic happens.

> ApiServiceImpl.java
>
> ```java
> @Singleton
> public class ApiServiceImpl extends ApiService {
>
>      @Inject
>      public ApiServiceImpl(PreferenceHelper preferenceHelper) {
>        super(preferenceHelper);
>      }
> }
> ```

To provide an instance of `PreferenceHelper`, Dagger figures out where to get it and then calls the constructor. Here's the generated factory class:

> ApiServiceImpl_Factory.java
>
> ```java
> public final class ApiServiceImpl_Factory implements Factory<ApiServiceImpl> {
>   private final Provider<PreferenceHelper> preferenceHelperProvider;
>
>   public ApiServiceImpl_Factory(Provider<PreferenceHelper> preferenceHelperProvider) {
>     this.preferenceHelperProvider = preferenceHelperProvider;
>   }
>
>   @Override
>   public ApiServiceImpl get() {
>     return new ApiServiceImpl(preferenceHelperProvider.get());
>   }
>
>   public static Factory<ApiServiceImpl> create(
>       Provider<PreferenceHelper> preferenceHelperProvider) {
>     return new ApiServiceImpl_Factory(preferenceHelperProvider);
>   }
> }
> ```

And `PreferenceHelper` is just a simple class with a `@Singleton` annotation up top and an empty constructor with `@Inject` annotation so Dagger knows this is a dependency to provide and its scope is Singleton.

Now, most of our provided classes used **field injection** instead of **constructor injection**, which doesn't play as nicely with Dagger so I had to write those new constructors and field assignments by hand but aside from that, didn't have to worry about where those dependencies came from. Eventually, my `AppModule.class` looked a lot like this:

> AppModule.java
>
> ```java
> @Module
> public class AppModule {
>    private Context appContext;
>
>    public AppModule(Context context) {
>       this.appContext = context.getApplicationContext();
>    }
>
>    @Provides
>    Context context() {
>       return appContext;
>    }
>
>    @Provides
>    ApiService apiService(ApiServiceImpl impl) {
>       return impl;
>    }
>
>    @Provides
>    Service1 service1(Service1Impl impl) {
>       return impl;
>    }
>
>    @Provides
>    Service2 service2(Service2Impl impl) {
>       return impl;
>    }
>
>    // A few other services ...
> }
> ```

Now that's done. Dependencies that didn't have to extend an abstract class or interface simply used `@Inject` in their constructor and Dagger provided them. On to `AppComponent.java`

> AppComponent.java
>
> ```java
> @Singleton
> @Component(modules = {AppModule.class})
> public interface AppComponent {
>   void inject(MyApp app);
>   void inject(MainActivity activity);
>   // Other activities, fragments, Broadcast Receivers, and Android Services
> }
> ```

We have some `@Inject` calls in our Application class (probably should clean that up now) so we call `inject(this)` in it, and also all activities, fragments, and Android services. Basically, wherever we can't use constructor injection.

## Almost there

Time to build the app so Dagger can generate all the code using its annotation processor. And finally, use that code in the custom Application class.

> MyApp.java
>
> ```java
> public class MyApp extends Application {
>    private static MyApp application;
>
>    @Inject
>    SomeDependency dependency;
>
>    @Override
>    public void onCreate() {
>        super.onCreate();
>        getAppComponent().inject(this);
>    }
>
>    public static NortonApplication getApplication>() {
>        return application;
>    }
>
>    public void createAppComponent() {
>        appComponent = DaggerAppComponent.builder().appModule(new AppModule(this)).build();
>    }
>
>    public static AppComponent getAppComponent() {
>        MyApp app = getApplication();
>        if (app.appComponent == null) {
>            app.createAppComponent();
>        }
>        return app.appComponent;
>    }
> ```

With this, at least the application class should be able to get its fields injected, but our Activities, Fragments, Broadcast Receivers, and Services still won't. For that, we need to call `inject(this)` in those too. That's why we have that static `getAppComponent()` method. So we simply call this in the `onCreate` method of all those classes (yes, fragments too because we might need to use those fields in `onStart`).

```java
MyApp.getAppComponent().inject(this);
```

## Optimizations

So this works, but it creates a lot of factory classes for us. Turns out, class loading is pretty slow on Android and the system needs to do that every time the app has been destroyed and launched again. That means cold launch time, while slightly better than RoboGuice can still be improved. That, I will cover in the next part. Until then, you can watch [this video about Dagger 2.12 optimizations](https://www.youtube.com/watch?v=PBrhRvhF00k).
