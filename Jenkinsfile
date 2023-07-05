pipeline {

    agent any;  

    stages {
        stage('Build'){
            steps {
                sh 'npm run buil'
            }
        } 
    }

   post{
       emailext attachLog: true, body: 'LOG:', subject: 'BUILD $BUILD_NUMBER suporte-quarkus Executado com Erro(s)!', to: 'thi4go19+jenkins@gmail.com'
   }

}