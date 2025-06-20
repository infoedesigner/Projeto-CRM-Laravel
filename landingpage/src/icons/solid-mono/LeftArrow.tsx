import IconProps from 'types/icon';

const LeftArrow = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-inject icon-svg solid-mono ${className || 'icon-svg-sm text-primary me-4'}`}
    >
      <path
        className="fill-secondary"
        d="M224 128L192 96 160 128 192 160z"
      />
    </svg>
  );
};

export default LeftArrow;