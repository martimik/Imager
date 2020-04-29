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
|-------|:------:|
|Ability to upload a new image | OK |
|Ability to list uploaded images | OK |
|Ability to remove an uploaded image | OK |
|Ability to vote (upvote, downvote) an image | OK |
|Ability to mark image as a favorite or remove it | OK |
|Ability to comment on a image | OK |
|Ability to edit or remove comments | OK |

### Advanced API functionality

|Feature|status|
|-------|:------:|
|Ability to create a user / register | OK |
|Ability to login and logout | OK |

### Extra credits

|Feature|status|
|-------|:------:|
|Multiple user levels (admin, normal user, anonymous) | OK |
|Public (shows up in recent uploads) and private (only visible to self) gallery | OK |
|Report this image feature | OK |

### Special requirements

|Feature|status|
|-------|:------:|
|Creating a docker-compose.yaml file with the appropriate environment | OK |

# Installation

This rest-api also requires [Infra](https://gitlab.labranet.jamk.fi/ttow0130/infra) to function properly.

Clone the repository and create .env file from .env.example with appropriate values. 

Build docker image and and start the services.

```
$ docker-compose build
$ docker-compose up

// or in detached mode 
$ docker-compose up -d
```

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
/images/{id}/reports

/comments/{id}

/reports
```


# Users


* Create a new user to the database if the given email is not already in use. Usergroup always defaults to normal user.

```
POST /users

Parameters: { username, password, email, userGroup }

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

Parameters: { }

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

Response: { [ image ] }
```


# Images


* Upload new image to the service. Requires an active user session.

```
POST /images

Parameters: { title, isPrivate, image (type: file) }

Response: { success }
```

* Return all images, excluding private images.

```
GET /images

Response: { [ image ] }
```

* Return specific image.

```
GET /images/{id}

Response: { image (type: file) }
```

* Delete specific image.

```
DELETE /images/{id}

Response: { success }
```


## Comments


* Get all comments of specific image

```
GET /images/{id}/comments

Response: { [ Comment ] }
```

* Add a comment to image.

```
POST /images/{id}/comments

Parameters: { content }

Response: { success }
```


## Votes

* Get votes by image.

```
GET /images/{id}/votes

Response: { [ Vote ] }
```

* Add vote or update database entry if it already exists.

```
POST /images/{id}/votes

Parameters: { type ('upvote' OR 'downvote') }

Response: { success }
```

## reports

* Get reports of a image. Requires admin userGroup.

```
GET /images/{id}/reports

Response: { [ Report ] }
```

* Add a report to image.

```
POST /images/{id}/reports

Parameters: { description }

Response: { success }
```


# Comments

Only the uploader of comment can do the following actions.

* Edit comment

```
PUT /comments/{id}

Parameters: { content }

Response: { success }
```

* Remove comment from image 

```
Delete /comments/{id}

Response: { success }
```

# Reports

* Return all reports in database. Requires admin userGroup.

```
GET /reports

Response: { [ Report ] }

```

# Test Routes

* Test backend is up

```
GET /test

Response: { message }

```

* Return active session data

```
GET /session

Response: { userId, name, email, userGroup }

```

# Depencies

* Express 
* Express-fileupload
* Express-session
* express-validator
* basic-auth
* Bcrypt
* Sequalize
* minio
* pg
* pg-hstore
* pino
* pino-pretty
* cors
* command-line-args

# Report

## Challenges and learning experiences

Most challenged were related to using docker and sequelize, for i had no previous experience of their use. Configurating the docker-compose file for backend took some trial and error to get it right. Especially connecting api container to the same network as infra and how docker resolves container adresses was a valuable realization about how docker operates. Although using sequelize was pretty simple, some features (OR select clauses for example) didnt work quite like in documentation.

Routing didn't also go exacly as planned, since i couldn't find a way to create routes with parameters according to the structure used in this project. This led to a large file know as images.js. Not sure if this is a limitation of express or is there a smart way to do that, but otherwise the structure should be manageable when writing (a lot of) more routes. 

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
|02.04.| Setting up cloud services | 6h |
|03.04.| Backend / documentation | 6h |
|07.04.| Backend | 4h |
|08.04.| Backend | 4h |
|13.04.| Backend | 5h |
|14.04.| Backend | 6h |
|15.04.| Backend | 6h |
|16.04.| Backend | 5h |
|17.04.| Backend | 8h |
|21.04.| Backend | 5h |
|24.04.| Backend | 5h |
|25.04.| Backend | 2h |
|27.04.| Docker  | 5h |
|28.04.| Docker  | 5h |
|29.04.| Docker/Report  | 3h |

Total: 76h
                                                           