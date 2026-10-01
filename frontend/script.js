// Elements
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearButton');

// The API endpoint URL
// Since the frontend is served by FastAPI, we use relative paths
const API_URL = '/api/chat';

// Function to append a message to the chat box
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
        messageDiv.textContent = `You: ${text}`;
    } else if (sender === 'ai') {
        messageDiv.classList.add('ai-message');
        messageDiv.textContent = `AI: ${text}`;
    } else if (sender === 'error') {
        messageDiv.classList.add('error-message');
        messageDiv.textContent = `Error: ${text}`;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// Function to show/hide the loading indicator
function toggleLoading(show) {
    if (show) {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('typing-indicator');
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        const loadingDiv = document.getElementById('loadingIndicator');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

// Main function to send the message
async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // 1. Display user message and clear input
    appendMessage(text, 'user');
    messageInput.value = '';
    
    // 2. Disable input and show loading state
    sendButton.disabled = true;
    messageInput.disabled = true;
    toggleLoading(true);

    try {
        // 3. Send POST request to FastAPI backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // 4. Handle response or error
        if (response.ok) {
            appendMessage(data.response, 'ai');
        } else {
            // Display error details returned from backend
            appendMessage(data.detail || "Something went wrong.", 'error');
        }

    } catch (error) {
        console.error("Network Error:", error);
        appendMessage("Network/API failure. Could not connect to the server.", 'error');
    } finally {
        // 5. Restore UI state
        toggleLoading(false);
        sendButton.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

// Allow pressing 'Enter' to send
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Clear chat button functionality
clearButton.addEventListener('click', () => {
    chatBox.innerHTML = `
        <div class="message system-message">
            Chat cleared. Send a message to start again.
        </div>
    `;
});
