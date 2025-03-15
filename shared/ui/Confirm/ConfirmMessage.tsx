interface IProps {
    messages: string[];
}

export const ConfirmMessage = ({ messages }: IProps) => (
    <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
            <p key={index}>{message}</p>
        ))}
    </div>
);
