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
        stage('Deploy Docker') {
            steps {
                echo "Imagem Docker"
                sh 'docker stop --if-exists fluxo-caixa-frontend'
                sh 'docker rm --if-exists fluxo-caixa-frontend'
                sh 'docker build -t fluxo-caixa-frontend:lts .'
                sh 'docker run --name fluxo-caixa-frontend --restart=always -d -p 3000:80 fluxo-caixa-frontend:lts'
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