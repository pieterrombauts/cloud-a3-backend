# Serverless setup

## Setup docker image

spin up a node image and run it interactively using bash

```sh
docker run -v ABSOLUTE_PATH_TO_WORKING_DIR:/working -it node bash
```

In the docker container run the following commands

1. install serverless

   ```sh
   npm install -g serverless
   ```

1. setup your profile

   ```
   serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET --profile cloud-computing-serverless-admin
   ```

1. exit docker
   ```
   exit
   ```

Now commit your docker image so you can use it later

1. Find the docker container id of the container you just exited
   ```
   sudo docker ps -a
   ```
2. Commit the image
   ```
   sudo docker commit CONTAINER_ID node-sls
   ```
3. Check to see if image was created successfully
   ```
   sudo docker images
   ```

Now you can use your docker image to compile and deploy your serverless functions 🎉🎉🎉

```
docker run -v ABSOLUTE_PATH_TO_WORKING_DIR:/working -it node-sls bash
```

## Deploy a service (group of functions and AWS services)

1. `cd` into the function folder.
2. Run the following command

```
sls deploy -v
```

## Update a single function

1. `cd` into the function folder
2. Run the following command

```
sls deploy function -f FUNCTION_NAME
```

## Destroy a service

1. `cd` into the function folder
2. Run the following command

```
sls remove
```
