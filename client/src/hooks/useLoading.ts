import { useLoadingContext } from "../provider/loadingProvider";

const useLoading = () => {
    const { show, hide } = useLoadingContext();
    const Loading = ({
        message,
    }: {
        message?: string;
    }) => {
        show(message);
        return () => hide();
    };

    return Loading;
};

export default useLoading;