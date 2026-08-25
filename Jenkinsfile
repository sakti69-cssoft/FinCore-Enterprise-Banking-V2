pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    tools {
        jdk 'JDK21'
        maven 'Maven3'
    }

    environment {
        KUBECONFIG = 'C:\\ProgramData\\Jenkins\\.kube\\config'
        HELM = 'C:\\ProgramData\\Jenkins\\tools\\helm\\helm.exe'
        KUBECTL = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\kubectl.exe'

        DOCKER_IMAGE = 'sakti97/fincore'
        HELM_RELEASE = 'fincore-helm'
        HELM_CHART = '.\\helm\\fincore'
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
                bat 'docker build -t %DOCKER_IMAGE%:%BUILD_NUMBER% .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'dockerhub-token-v2',
                        variable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    powershell '''
                        $configDir = Join-Path $env:WORKSPACE ".docker-temp"
                        New-Item -ItemType Directory -Force -Path $configDir | Out-Null

                        try {
                            $pair = "sakti97:$($env:DOCKERHUB_TOKEN)"

                            $auth = [Convert]::ToBase64String(
                                [Text.Encoding]::ASCII.GetBytes($pair)
                            )

                            $config = @{
                                auths = @{
                                    "https://index.docker.io/v1/" = @{
                                        auth = $auth
                                    }
                                }
                            } | ConvertTo-Json -Depth 5

                            $configFile = Join-Path $configDir "config.json"
                            Set-Content -Path $configFile -Value $config -Encoding ASCII

                            $image = "$($env:DOCKER_IMAGE):$($env:BUILD_NUMBER)"
                            $pushOk = $false

                            for ($attempt = 1; $attempt -le 3; $attempt++) {
                                Write-Host "Docker push attempt $attempt of 3: $image"

                                docker --config $configDir push $image

                                if ($LASTEXITCODE -eq 0) {
                                    $pushOk = $true
                                    break
                                }

                                if ($attempt -lt 3) {
                                    Write-Host "Push failed. Retrying in 10 seconds..."
                                    Start-Sleep -Seconds 10
                                }
                            }

                            if (-not $pushOk) {
                                throw "Docker Hub push failed after 3 attempts."
                            }

                            Write-Host "Docker Hub push: SUCCESS"
                        }
                        finally {
                            Remove-Item $configDir -Recurse -Force -ErrorAction SilentlyContinue
                        }
                    '''
                }
            }
        }
        stage('Helm Deploy') {
            steps {
                bat '''
                "%HELM%" upgrade %HELM_RELEASE% %HELM_CHART% ^
                --install ^
                --namespace default ^
                --set image.repository=%DOCKER_IMAGE% ^
                --set image.tag=%BUILD_NUMBER% ^
                --set image.pullPolicy=Always ^
                --wait ^
                --timeout 5m
                '''
            }
        }

        stage('Kubernetes Health Check') {
            steps {

                bat '''
                "%KUBECTL%" rollout status deployment/%HELM_RELEASE%-fincore ^
                --namespace default ^
                --timeout=180s
                '''

                bat '''
                "%KUBECTL%" wait ^
                --for=condition=ready ^
                pod ^
                -l app=fincore,instance=%HELM_RELEASE% ^
                --namespace default ^
                --timeout=180s
                '''

                bat '''
                "%KUBECTL%" get pods ^
                -l instance=%HELM_RELEASE% ^
                --namespace default
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
            echo '================================================='
            echo 'FinCore CI/CD pipeline completed successfully.'
            echo 'Docker image pushed to Docker Hub.'
            echo 'Helm deployment completed.'
            echo 'Kubernetes pods are READY.'
            echo '================================================='
        }

        failure {
            echo '===================================='
            echo 'FinCore CI/CD pipeline FAILED.'
            echo 'Check the failed stage and console log.'
            echo '===================================='
        }
    }
}
