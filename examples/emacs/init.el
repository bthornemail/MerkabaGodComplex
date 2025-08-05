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

;; Start WebSocket server
(defun start-websocket-server ()
  "Start a WebSocket server to listen for commands from Node.js."
  (interactive)
  (let ((server (websocket-server 9000
                                  :host 'local
                                  :on-message 'handle-websocket-message)))
    (message "WebSocket server started on ws://localhost:9000")))

;; Start the server
(start-websocket-server)
