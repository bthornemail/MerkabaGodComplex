(defun setup-tide-mode ()
  (interactive)
  (tide-setup)
  (flycheck-mode +1)
  (setq flycheck-check-syntax-automatically '(save mode-enabled))
  (eldoc-mode +1)
  (tide-hl-identifier-mode +1)
  ;; company is an optional dependency. You have to
  ;; install it separately via package-install
  ;; `M-x package-install [ret] company`
  (company-mode +1))

;; aligns annotation to the right hand side
(setq company-tooltip-align-annotations t)

;; formats the buffer before saving
(add-hook 'before-save-hook 'tide-format-before-save)

;; if you use typescript-mode
(add-hook 'typescript-mode-hook #'setup-tide-mode)

;; if you use typescript-mode
(use-package tide
  :ensure t
  :after (typescript-mode company flycheck)
  :hook ((typescript-mode . tide-setup)
	 (typescript-mode . tide-hl-identifier-mode)
	 (before-save . tide-format-before-save)))

(require 'websocket)

;; Handle WebSocket messages by evaluating Lisp code
(defun handle-websocket-message (ws frame)
  "Handle WebSocket messages by evaluating the received Lisp code."
  (let ((lisp-command (websocket-frame-text frame)))
    (condition-case err
        (let ((result (eval (read lisp-command)))) ; Evaluate the Lisp code
          (websocket-send-text ws (format "Result: %s" result))) ; Send back the result
      (error
       ;; Send error message if evaluation fails
       (websocket-send-text ws (format "Error: %s" (error-message-string err)))))))

(require 'websocket)

(defun send-buffer-content-to-nodejs (buffer-name)
  "Send the content of the buffer BUFFER-NAME to a Node.js process via WebSocket."
  (let ((buffer-content (with-current-buffer buffer-name (buffer-string)))
        (ws (websocket-connect "ws://localhost:8085")))
    (websocket-send ws buffer-content)))
