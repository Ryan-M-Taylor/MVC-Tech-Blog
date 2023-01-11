const commentFormHandler = async (event) => {
    
    event.preventDefault();
    
    const comment = document.querySelector('#comment').value.trim();
    
    if (comment) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.ok) {
            document.location.replace('/project');
        } else {
            alert('Failed to create comment');
            throw new Error(response.statusText);
        }
    }
};

document.querySelector('.comment-btn').addEventListener('submit', commentFormHandler);