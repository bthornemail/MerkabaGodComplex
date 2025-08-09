(require 'package)
(add-to-list 'package-archives '("melpa-stable" . "https://stable.melpa.org/packages/") t)
(package-initialize)
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
   '(company-web tree-sitter-langs tree-sitter jtsx flymake-eslint flycheck flycheck-yamllint yaml-mode obsidian company typescript-mode tide ac-html csv-mode js2-highlight-vars js2-mode json-mode jsonrpc web-mode)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )

(load "~/relay.websocket.el")
(load "~/ollama-org-chat.el")
(load "~/emacs.api.el")
(load "~/ollama.api.call.el")
