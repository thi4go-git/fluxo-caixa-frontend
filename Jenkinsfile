pipeline {

    agent any;  

    stages {
        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'NODE', configId: '<config-file-provider-id>') {
                    sh 'npm install'
                }
            }
        }
        stage('Log Docker'){
            steps {
                echo "Verificando Container..."
                sh 'docker ps'
            }
        } 
    }

   post{
        always {
            script {
                if (currentBuild.result == 'FAILURE') {
                    echo "Build Com erro(s)!"
                    emailext attachLog: true, body: 'LOG:', subject: "BUILD ${BUILD_NUMBER} fluxo-caixa-frontend Executado com Erro(s)!", to: 'thi4go19+jenkins@gmail.com'
                } else {
                    echo "Build bem-sucedido!"
                    emailext attachLog: true, body: 'LOG:', subject: "BUILD ${BUILD_NUMBER} fluxo-caixa-frontend Executado com Sucesso!", to: 'thi4go19+jenkins@gmail.com'
                }
            }
        }
   }

}