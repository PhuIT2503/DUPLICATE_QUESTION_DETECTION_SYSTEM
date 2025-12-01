import { FaStar } from 'react-icons/fa';

export default function Rating({ value, onChange }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-2xl focus:outline-none"
        >
          <FaStar
            className={star <= value ? 'text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}