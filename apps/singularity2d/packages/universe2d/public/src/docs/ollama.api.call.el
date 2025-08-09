(defun ollama-api-call (model prompt)
  "Send a prompt to the Ollama model and return the response."
  (let* ((url "http://127.0.0.1:11434/api/generate")
         (data (json-encode `(("model" . ,model) ("prompt" . ,prompt))))
         (url-request-method "POST")
         (url-request-data data)
         (url-request-extra-headers '(("Content-Type" . "application/json"))))
    (with-temp-buffer
      (url-retrieve-synchronously url t t)
      (goto-char (point-min))
      (re-search-forward "\n\n")
      (buffer-substring-no-properties (point) (point-max)))))
