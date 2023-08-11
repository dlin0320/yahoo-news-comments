# Yahoo News Comments
This project is to scrape the comments from Yahoo News articles and store them in a database.  The comments then can be retrieved throught a REST API for further analysis.

## Prerequisites
* Docker

## How to run

*first time running*

run the following command to create the volume for the database
```
docker volume create yahoo-news-comments-db  
```

*subsequent runs*

just run the following command to start the containers
```
docker-compose up
```

*stop the containers*

```
docker-compose down
```

## APIs

### Get all articles with comments
```
GET http://localhost:3000/articles
```