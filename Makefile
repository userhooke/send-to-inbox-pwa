deploy-ui:
	aws s3 sync ui s3://send-to-inbox.hooke.dev --region eu-west-1

ui-server:
	python3 -m http.server 5501 -d ui

pretty:
	npx prettier --write .
