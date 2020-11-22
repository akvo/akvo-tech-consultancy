import { useForm } from "react-hook-form";

const handleServerErrors = setError => errors => {
    return Object.keys(errors).forEach(key => {
        setError(key, {
            type: "server",
            message: errors[key].join(". ")
        });
    });
};

export default () => {
    const props = useForm();
    const { setError } = props;
    const setServerErrors = handleServerErrors(setError);

    return { ...props, setServerErrors };
};
