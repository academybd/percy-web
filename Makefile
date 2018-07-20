_pull_parent_image:
	gcloud auth configure-docker --quiet
	docker pull $$(grep '^FROM' Dockerfile | grep -o ' .*' | tr -d ' ')

build: _pull_parent_image
	docker-compose build

build-test: _pull_parent_image
	docker-compose build --build-arg testing="true" web

test: _pull_parent_image
	docker-compose run web sh -c "yarn percy-agent:start && yarn test:parallel && yarn percy-agent:stop"

publish:
	@utils/publish
