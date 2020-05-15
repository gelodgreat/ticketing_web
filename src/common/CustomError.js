class CustomError {

    getError(error) {
        if (error.response) {

            const errorResponse = error.response.data;

            if (typeof errorResponse.message === "string") {
                console.log(errorResponse.message)
                var errorArrays = ["Invalid Authentication Credentials", "Access Expired", "Unuthorized Access"];
                if (errorResponse.message) {
                    if (errorArrays.includes(errorResponse.message)) {
                        localStorage.clear();
                        window.location.href = "/login"
                    } else if (errorResponse.message === "Token has expired") {
                        setTimeout(() => {
                            localStorage.clear();
                            window.location.href = "/login"
                        }, 2000);
                        return "Your session has expired! Please login again."
                    }
                    return errorResponse.message
                }
            } else {
                return errorResponse.message
            }
        } else if (error.message === "Cannot read property 'token' of null") {
            window.location.href = "/login"
        }

        return error.message
    }
}

export default CustomError;