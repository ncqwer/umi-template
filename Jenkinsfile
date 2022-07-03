pipeline {
  agent any
  stages {

    stage("Checkout") {
      steps {
        checkout(
          [$class: 'GitSCM',
          branches: [[name: GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: GIT_REPO_URL,
              credentialsId: CREDENTIALS_ID
            ]]]
        )
      }
    }


    stage('Build and Push Docker') {
      steps {
        script {
					sh 'yarn'
					withCredentials([
            usernamePassword(
              credentialsId: "${COS_CREDENTIAL_ID}",
              usernameVariable: 'COS_SECRETID',
              passwordVariable: 'COS_SECRETKEY'
            )
					]) {
						withEnv([
							"COS_SECRETID=${COS_SECRETID}",
							"COS_SECRETKEY=${COS_SECRETKEY}"
						]){
							sh 'yarn env:fill'
						}
					}	
					sh 'yarn build'
					sh 'yarn oss:depoly'
					sh 'yarn docker-compose:fill'
					withCredentials([
            usernamePassword(
              credentialsId: "${DOCKERHUB_CREDENTIAL_ID}",
              usernameVariable: 'DOCKERHUB_USERNAME',
              passwordVariable: 'DOCKERHUB_PASSWORD'
            )
					]) {
						docker.withRegistry(
							"https://registry.hub.docker.com", 
							"${DOCKERHUB_CREDENTIAL_ID}"
						) {
							def dockerImage = docker.build("${DOCKERHUB_USERNAME}/${PROJECT_NAME}:${COMMIT_REF_NAME}")
							dockerImage.push()
						}
					}
        }
      }
    }
        

    stage('Restart docker-compose service') {
      steps {
        script {
          def remoteConfig = [:]
          remoteConfig.name = "deploy"
          remoteConfig.host = "${env.SSH_HOST}"
          remoteConfig.allowAnyHosts = true

          withCredentials([
						sshUserPrivateKey(
              credentialsId: "${SSH_KEY}",
              keyFileVariable: "privateKeyFilePath"
            ),
						usernamePassword(
              credentialsId: "${DOCKERHUB_CREDENTIAL_ID}",
              usernameVariable: 'DOCKERHUB_USERNAME',
              passwordVariable: 'DOCKERHUB_PASSWORD'
            )
					]) {
            // SSH 登陆用户名
            remoteConfig.user = "${SSH_USERNAME}"
            // SSH 私钥文件地址
            remoteConfig.identityFile = privateKeyFilePath

           // 请确保远端环境中有 Docker 环境
           sshCommand(
             remote: remoteConfig,
             command: "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD} https://registry.hub.docker.com",
             sudo: true
           )
          
            FILE_DOCKER_COMPORSE  = sh(
              script:"cat docker-compose.yml",
              returnStdout: true
            );

						PROJECT_DIR = sh(
							script: "echo project/${PROJECT_NAME}/${COMMIT_REF_NAME}"
						);

            echo "${FILE_DOCKER_COMPORSE}";

            sshCommand(remote: remoteConfig, command:'echo "写入执行文件" ');
            sshCommand (remote: remoteConfig, command: 'cd '+"~/${PROJECT_DIR}"+' &&  echo "'+"${FILE_DOCKER_COMPORSE}"+ '" > docker-compose.yml');

            // sshCommand(remote: remoteConfig, command:'echo "清空24小时前的未被使用的任何image数据以节省性能" ');
            // sshCommand (remote: remoteConfig, command: 'docker image prune -a --force --filter "until=24h"');
            sshCommand (remote: remoteConfig, command: 'cd '+"~/${PROJECT_DIR}"+' && docker-compose down && docker-compose pull && docker-compose up -d --remove-orphans');
          }
        }

      }
    }
  }
  environment {
    CODING_DOCKER_IMAGE_NAME = "${PROJECT_NAME.toLowerCase()}/${DOCKER_REPO_NAME}/${DOCKER_IMAGE_NAME}"
		COMMIT_REF_NAME = "${GIT_BUILD_REF}"
		// COS_CREDENTIAL_ID = 
		// COS_REGION = 
		// COS_BUCKET = 
		// PROJECT_DOMAIN = 
		// PROJECT_NAME = 
		// DOCKER_CREDENTIAL_ID = 
		// SSH_HOST =  
		// SSH_USERNAME = 
		// SSH_KEY = 
  }
}