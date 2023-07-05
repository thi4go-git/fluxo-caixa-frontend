pipeline {

    agent any;  

    stages {
        stage('Install NPM'){
            steps {
                echo "Instalando dependências..."
                sh 'npm install'
            }
        } 
        stage('Build'){
            steps {
                echo "Gerando imagem Docker..."
                sh 'docker build -t fluxo-caixa-frontend:lts .'
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
                    emailext attachLog: true, body: 'LOG:', subject: "BUILD ${BUILD_NUMBER} suporte-quarkus Executado com Erro(s)!", to: 'thi4go19+jenkins@gmail.com'
                } else {
                    echo "Build bem-sucedido!"
                    emailext attachLog: true, body: 'LOG:', subject: "BUILD ${BUILD_NUMBER} suporte-quarkus Executado com Sucesso!", to: 'thi4go19+jenkins@gmail.com'
                }
            }
        }
   }

}