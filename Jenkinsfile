pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    tools {
        jdk 'JDK21'
        maven 'Maven3'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Test') {
            steps {
                bat 'mvn clean test'
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Package') {
            steps {
                bat 'mvn -DskipTests package'
            }
        }

        stage('Trivy FS') {
            steps {
                bat 'trivy fs --exit-code 0 --severity HIGH,CRITICAL .'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t fincore:%BUILD_NUMBER% .'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'fincore-db-password',
                        variable: 'DB_PASSWORD'
                    ),
                    string(
                        credentialsId: 'fincore-admin-password',
                        variable: 'FINCORE_ADMIN_PASSWORD'
                    )
                ]) {

                    // Remove previous FinCore container if it exists
                    bat 'docker rm -f fincore-app 2>nul || ver >nul'

                    // Deploy newly built image
                    bat '''
                    docker run -d ^
                    --name fincore-app ^
                    --network fincore-enterprise-banking-v2_default ^
                    -p 8081:8080 ^
                    -e SPRING_PROFILES_ACTIVE=mysql ^
                    -e DB_URL=jdbc:mysql://mysql:3306/enterprise_banking ^
                    -e DB_USERNAME=bankuser ^
                    -e DB_PASSWORD ^
                    -e REDIS_HOST=redis ^
                    -e REDIS_PORT=6379 ^
                    -e MONGODB_URI=mongodb://mongo:27017/fincore_audit ^
                    -e SERVER_PORT=8080 ^
                    -e FINCORE_ADMIN_EMAIL=admin@bank.local ^
                    -e FINCORE_ADMIN_PASSWORD ^
                    -e FINCORE_CORS_ORIGINS=http://localhost:5174,http://localhost:5173 ^
                    fincore:%BUILD_NUMBER%
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                powershell '''
                    $ok = $false

                    for ($i = 1; $i -le 30; $i++) {

                        try {

                            $response = Invoke-RestMethod `
                                -Uri "http://localhost:8081/actuator/health" `
                                -TimeoutSec 2

                            if ($response.status -eq "UP") {

                                Write-Host "FinCore health: UP"

                                $ok = $true

                                break
                            }

                        }
                        catch {

                            Write-Host "Waiting for FinCore... attempt $i"
                        }

                        Start-Sleep -Seconds 2
                    }

                    if (-not $ok) {

                        Write-Host "FinCore application failed health check"

                        docker logs fincore-app

                        exit 1
                    }
                '''
            }
        }
    }

    post {

        always {
            junit allowEmptyResults: true,
                  testResults: 'target/surefire-reports/*.xml'
        }

        success {
            echo '=============================================='
            echo 'FinCore CI/CD pipeline completed successfully.'
            echo 'Application: http://localhost:8081'
            echo 'Health: http://localhost:8081/actuator/health'
            echo '=============================================='
        }

        failure {
            echo '===================================='
            echo 'FinCore CI/CD pipeline FAILED.'
            echo 'Check the failed stage and console log.'
            echo '===================================='
        }
    }
}