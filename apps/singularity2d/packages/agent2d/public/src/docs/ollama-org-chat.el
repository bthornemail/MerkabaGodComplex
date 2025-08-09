(require 'org)
(require 'request)

(defvar ollama-api-url "http://127.0.0.1:11434/api/chat"
  "Ollama API endpoint for chatbot interaction.")

(defun ollama-send-source-block ()
  "Send the current Org source block to the Ollama chatbot."
  (interactive)
  (let* ((info (org-babel-get-src-block-info))
         (language (nth 0 info))
         (code (nth 1 info)))
    (if (and info language code)
        (request ollama-api-url
          :type "POST"
          :headers '(("Content-Type" . "application/json"))
          :data (json-encode `(("model" . "deepseek-r1:1.5b") ;; Change this to your preferred Ollama model
                               ("messages" . [(("role" . "user") ("content" . ,code))])
                               ("stream" . :false)))
          :parser 'json-read
          :success (cl-function
                    (lambda (&key data &allow-other-keys)
                      (let ((response (alist-get 'message (aref (alist-get 'messages data) 0))))
                        (when response
                          (save-excursion
                            (goto-char (org-element-property :end (org-element-at-point)))
                            (insert (format "\n#+RESULTS:\n%s\n" response)))
                          (message "Response received and inserted!"))))))
      (message "Not inside a valid Org source block."))))

(defun ollama-send-buffer ()
  "Send the entire Org Mode buffer as context to Ollama chatbot."
  (interactive)
  (let ((buffer-content (buffer-string)))
    (request ollama-api-url
      :type "POST"
      :headers '(("Content-Type" . "application/json"))
      :data (json-encode `(("model" . "codellama") ;; Change this model if needed
                           ("messages" . [(("role" . "user") ("content" . ,buffer-content))])
                           ("stream" . :false)))
      :parser 'json-read
      :success (cl-function
                (lambda (&key data &allow-other-keys)
                  (let ((response (alist-get 'message (aref (alist-get 'messages data) 0))))
                    (when response
                      (with-current-buffer (get-buffer-create "*Ollama Chat Output*")
                        (erase-buffer)
                        (insert response)
                        (org-mode)
                        (display-buffer (current-buffer))))))))))

;; Keybindings for quick access
(global-set-key (kbd "C-c o s") 'ollama-send-source-block)
(global-set-key (kbd "C-c o B") 'ollama-send-buffer)

(provide 'ollama-org-chat)
