
```yaml
model: emacs-org-agent
parameters:
  temperature: 0.7
    max_tokens: 1000
	  stop_sequences: ["#+END_SRC"]
	    tools:
		    - name: emacs-eval
			      description: Evaluate Emacs Lisp code and return the result.
				      - name: org-babel-execute
					        description: Execute Org Babel source blocks and return the output.
							```
							
							#### Example Interaction:
							Below is an example of how a user might interact with the `emacs-org-agent` in an Org file:
							
							```org
							#+BEGIN_SRC emacs-lisp :session :results output
							  ;; Ask the agent to evaluate some Emacs Lisp code
							    (message "Hello, Emacs Org Agent!")
								#+END_SRC
								
								#+BEGIN_SRC emacs-org-agent :session :results output
								  ;; Agent responds with the result of the evaluation
								    Hello, Emacs Org Agent!
									#+END_SRC
									
									#+BEGIN_SRC emacs-lisp :session :results output
									  ;; Ask the agent to list files in the current directory
									    (directory-files default-directory)
										#+END_SRC
										
										#+BEGIN_SRC emacs-org-agent :session :results output
										  ;; Agent responds with the list of files
										    ("file1.org" "file2.txt" "file3.el")
											#+END_SRC
											```
											
											#### Tools:
											1. **Emacs Eval**:
											   - **Description**: Evaluates Emacs Lisp code and returns the result.
											      - **Usage**: The agent can execute arbitrary Emacs Lisp code provided by the user and return the output.
												  
												  2. **Org Babel Execute**:
												     - **Description**: Executes Org Babel source blocks and returns the output.
													    - **Usage**: The agent can execute code blocks written in various languages (e.g., Python, Shell) and return the results.
														
														#### Training Data:
														The model is trained on a combination of:
														- Emacs Org Mode documentation and examples.
														- Emacs Lisp code snippets and their outputs.
														- Conversational data in Org Mode syntax.
														
														#### Use Cases:
														- **Automating Emacs Workflows**: Users can automate repetitive tasks in Emacs by interacting with the agent.
														- **Interactive Documentation**: The agent can help users learn Emacs Lisp by providing examples and executing code snippets.
														- **Reproducible Research**: Researchers can use the agent to document and execute computational workflows in Org Mode.
														
														#### Limitations:
														- The agent is limited to tasks that can be performed within Emacs and its ecosystem.
														- Complex interactions may require multiple back-and-forth exchanges
