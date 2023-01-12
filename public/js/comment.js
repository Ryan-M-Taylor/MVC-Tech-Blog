const commentFormHandler = async (event) => {
    event.preventDefault();

    const comment_text = document.querySelector('#comment-text').value;
    const id = document.querySelector('#id').value;

    if (comment_text && id) {
        const response = await fetch(`/api/comments/${id}`, {
            method: 'POST',
            body: JSON.stringify({ comment_text }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace(`/projects/${id}`);
        } else {

            alert('Failed to create comment');
            throw new Error(response.statusText);
        }
    }


};

document.querySelector('.comment-btn').addEventListener('click', commentFormHandler);