//submits comment when button is clicked

const commentFormHandler = async (event) => {
    event.preventDefault();

    const comment_text = document.querySelector('#comment-text').value.trim();
    const project_id = document.querySelector('#project-id').value.trim();


    if (comment_text && project_id) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment_text, project_id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {

            alert('Failed to create comment');
            throw new Error(response.statusText);
        }
    }


};

document.querySelector('.comment-btn').addEventListener('submit', commentFormHandler);