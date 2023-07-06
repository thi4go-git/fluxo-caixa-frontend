pipeline {

    agent any;  

    tools{
        nodejs 'NODE_20.4.0'
    }

    stages {
        stage('Dependencias') {
            steps {
                echo "Instalando dependências"
                sh 'npm install'
            }
        }
        stage('NPM Build') {
            steps {
                echo "Instalando dependências"
                sh 'npm run build'
            }
        }
        stage('Imagem Docker') {
            steps {
                echo "Imagem Docker" 
                sh 'docker build -t fluxo-caixa-frontend:lts .'           
            }
        }
        stage('Deploy'){
            steps {
               sh 'docker-compose build'
               sh 'docker-compose up -d'
            }
        }
        stage('Limpando Cache'){
           steps {
                sleep(10)
                sh 'docker system prune -f'
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