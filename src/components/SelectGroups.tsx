import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-shadcn/Select';

export default function SelectGroups({
  groups,
  defaultValue,
  selectedGroup,
  handleValueChange,
  selectItemsHeader,
}) {
  return (
    <Select
      onValueChange={(e) => {
        const matchingGroup = groups.filter((group) => group.name === e)[0];
        handleValueChange(matchingGroup);
      }}
      defaultValue={defaultValue}
      // comment out value={} if don't need to use state (controlled component) and want to use redirect (func fron next/navigation) w/o having to use state
      value={selectedGroup?.name ?? undefined}
    >
      <SelectTrigger
      // className="w-[180px]"
      >
        <SelectValue placeholder="Choose a group" />
      </SelectTrigger>
      <SelectContent className="bg-secondary">
        <SelectGroup>
          <SelectLabel>{selectItemsHeader}</SelectLabel>
          {groups.map((group) => (
            <SelectItem
              className="focus:bg-background cursor-pointer"
              key={group.id}
              value={group.name}
            >
              {group.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
