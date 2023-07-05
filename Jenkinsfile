pipeline {

    agent any;  

    stages {
        stage('Install NPM'){
            steps {
                sh 'npm install'
            }
        } 
    }

   post{
        always {
            emailext attachLog: true, body: 'LOG:', subject: "BUILD ${BUILD_NUMBER} suporte-quarkus Executado com Erro(s)!", to: 'thi4go19+jenkins@gmail.com'
        }
   }

}