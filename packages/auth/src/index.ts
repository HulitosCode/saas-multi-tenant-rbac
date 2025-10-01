import { Ability, AbilityBuilder, ForcedSubject } from "@casl/ability";

const actions = ["manage", "invite", "delete"] as const;
const subjects = ["User", "all"] as const;
type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], "all">>
  ),
];
export type AppAbility = Ability<AppAbilities>;

const { build, can, cannot } = new AbilityBuilder(Ability);

can("invite", "User");
cannot("delete", "User");

export const ability = build();
