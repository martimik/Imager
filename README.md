# Image sharing service REST API

### Mikko Martikainen / K8936

This repository contains "Coding REST API" assignment for TTOW0130 - Service-Oriented Applications. This assignments consists of the following parts:

* API documentation
* Report
* Source code

[Link to the assigment](http://ttow0130.pages.labranet.jamk.fi/Assignments/API-coding/)

# Features

### Core API functionality

|Feature|status|
|-------|------|
|Ability to upload a new image | OK |
|Ability to list uploaded images | OK |
|Ability to remove an uploaded image | OK |
|Ability to vote (upvote, downvote) an image | Not implemented |
|Ability to mark image as a favorite or remove it | Not implemented |
|Ability to comment on a image |Not implemented |
|Ability to edit or remove comments | Not implemented |

### Advanced API functionality

|Feature|status|
|-------|------|
|Ability to create a user / register | OK |
|Ability to login and logout | OK |
|Able to list most "trending" images | Not implemented |
|Logging is done to an external logging server | Not implemented |

### Extra credits

|Feature|status|
|-------|------|
|API contains tests | Not implemented |
|Ability to download favorites as a zip / export | Not implemented |
|Login using a Google / Facebook / etc. account | Not implemented |
|Multiple user levels (admin, normal user, anonymous) | OK |
|Public (shows up in recent uploads) and private (only visible to self) gallery | OK |
|Report this image feature | Not implemented |

### Special requirements

|Feature|status|
|-------|------|
|Usage of Gitlab CI to build a docker image of the API and upload it to Gitlab container registry | Not implemented |
|Creating a docker-compose.yaml file with the appropriate environment | Not implemented |

# Database

## Database description

Data is stored inside postgreSql database.

![](db-schema.PNG)

# API Documentation

## Usergroups

Usergroups are used to control the usage of API features. Valid usergroups are: 

```
    0: Admin
    1: Normal user
    (2: Anonymous)
```

Resource URIs

```
/users
/users/login
/users/logout
/users/favorites
/users/favorites/{id}
/users/private

/images
/images/{id}
/images/{id}/votes
/images/{id}/comments

/comments/{id}
```

## Users

* Create a new user to the database if the given email is not already in use. Usergroup always defaults to normal user.

```
POST /users

Parameters: { userName, password, email }
Response: { success }
```

## Login

* Authenticate the user and creates a session on the server. 

```
POST /users/login

Parameters as basic-auth: { email, password }
Response: { userId, name, email, userGroup }
```

## logout

* Destroy the session on the server if it exists.

```
POST /users/logout
Response: { success }
```

## Favorites

* Get user favorite images

```
GET /users/favorites
Parameters: { userId }
Response: { [ image ] }
```

* Add image to user favorites

```
POST /users/favorites
Parameters: { imageId }
Response: { success }
```

* Remove image from user favorites

```
DELETE /users/favorites/{id}
Response: { success }
```

## Private 

* Get user private images

```
GET /users/private
Parameters: {  }
Response: { [ image ] }
```

## Images

* Upload new image to the service. Requires an active user session.

```
POST /images

Parameters: { title, isPrivate, imgFile }
Response: { success }
```

* Return all images, exlude other users private images.

```
GET /images

Parameters: {  }
Response: { [ image ] }
```

* Return a specific image.

```
GET /images/{id}

Parameters: { }
Response: { image }
```

* Add a comment to image.

```
POST /images/{id}/comments
Parameters: { comment }
Response: { tbd }
```


## Votes

* Add upvote or downvote for image if it does not already exist. 

```
POST /images/{id}/votes
Parameters: { type }
Response: { tbd }
```

## Comments

* Edit comment

```
PUT /comments/{id}
Parameters: { newComment }
Response: { tbd }
```

* Remove comment from image 

```
Delete /comments/{id}
Parameters: { }
Response: { tbd }
```

## Test Routes

* Returns active session data

```
GET /session
Parameters: {}
Response: { userId, name, email, userGroup }

```

# Depencies

* Express 
* Express-fileupload
* Express-session
* express-validator
* pino
* cors
* Sequalize
* minio
* command-line-args
* basic-auth
* Bcrypt

# Report

# Notes 

## CSC Services

* cPouta instance must be "medium"-size, small runs out of memory and services crash.
* To access services via browser, http- and tcp-traffic must be allowed in security group rules.
* Establishing shh-connection with virtual machine also requires the user account name, which [depends on the image used](https://docs.csc.fi/cloud/pouta/connecting-to-vm/), to gain access.


### Time Tracking

|Date| Feature |Hours|
| --- | --- | --- |
|14.03.| initial documentation | 2h |
|26.03.| Database and api-documentation | 4h |
|02.04.| Setting up cloud services | 8h |
|03.04.| Backend / dokumentation | 6h |
|07.04.| Backend | 4h |
|08.04.| Backend | 4h |
|13.04.| Backend | 6h |
|14.04.| Backend | 6h |
|15.04.| Backend | 6h |
|16.04.| Backend | 6h |
|17.04.| Backend | 10h |

Total: 62h
