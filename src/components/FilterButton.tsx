/** @format */

type FilterButtonProps = {
  isPressed: boolean;
  name: string;
  setFilter: (name: string) => void;
};

export default function FilterButton({
  name,
  isPressed,
  setFilter,
}: FilterButtonProps) {
  return (
    <button
      type='button'
      className='filter-button'
      aria-pressed={isPressed}
      onClick={() => setFilter(name)}
      key={name}
    >
      <span>{name}</span>
    </button>
  );
}
