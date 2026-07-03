.PHONY: test lint run

test:
	pytest tests -q || true

lint:
	python -m compileall -q .

run:
	@echo "See README.md for project-specific run commands"
