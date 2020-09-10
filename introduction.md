# Introduction

## What is Redux-optimum



_**Optimistic REST API**_ calls are becoming a standard in the world of _Single Page Applications_ but managing them is never easy. Where to place the data in the application, how to reconcile server data and client data, what to do during network failures, or how to manage identifiers \(tokens in headers or session cookies\)? All these questions need to be answered when dealing with a complex front-end application. Yet, there is no easy, nor a one shoe fits all kind of solution. Nevertheless, why does it need to be so complex and defined at every call level when we can abstract those decisions in a centralized manner with standardized procedures. This is exactly the aim of this library. Of course, it does not cover all the edge cases but it tries to abstract all the possible implementations for API management in a series of options. It is based on the existing _**Redux**_ library and the middleware _**Redux-saga**._

### This is what it allows you to do:

{% hint style="info" %}
* Make server calls while notifying the application of what is changing and of the different stages of the call.

  * Imagine, you have most of the data you need from the client submission to print a new screen but still need an id coming back from the server. Well, you can print immediately on screen and reconcile the coming data from the server when it gets to the client. If the call fails, you can revert back to the previous screen.

* Define what constitutes a call failure, or just a temporary outage.

  * Maybe the call returns 502s, as the server is overloaded. You don't want the state transition of the app to fail for so little. Maybe you tell the queue manager of _**Redux-optimum**_ to retry when you get 502s. With _**Redux-optimum**_, you can set per API endpoints what constitutes a failure and how many times you want to retry it.

* Queue up all requests in order if network is not available.

  * When the network is not available or when an API endpoint keeps failing, you can decide that all subsequent calls will be queued and retried later on.

* Automatic Authorization Token Refresh.

  * A call might return that the Authorization Token is expired. Obviously, you don't want to log out if you have a refresh token in your possession. Define your own methods and the token will be refreshed before retying the call.

* State Persistence on localstorage.
  * Close your browser, open it back up, the store will be in the same state, API queues and all.
{% endhint %}

A config file is all you need to define all the behaviors for your API management system. One place to rule them all.

