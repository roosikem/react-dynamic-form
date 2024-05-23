const onPublish = async () => {
        try {
            const values = await form.validateFields();
            update({
                resource: "posts", // replace with your resource name
                id: queryResult?.data?.data.id, // assuming the form is used to edit an existing resource
                values: { ...values, status: "published" },
            }, {
                onSuccess: () => {
                    notification.success({
                        message: 'Published',
                        description: 'The post has been published!',
                    });
                },
                onError: () => {
                    notification.error({
                        message: 'Error',
                        description: 'Failed to publish the post!',
                    });
                },
            });
        } catch (errorInfo) {
            notification.error({
                message: 'Error',
                description: 'Please fix the errors in the form!',
            });
            console.log('Validation Failed:', errorInfo);
        }
    };
