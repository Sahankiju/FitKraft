
import {
  createTheme,
  Title,
  Text,
  Button,
  Badge,
  TextInput,
  Textarea,
  PasswordInput,
  NumberInput,
  Select,
  MultiSelect,
  Checkbox,
  Radio,
  Switch,
  Input,
  Autocomplete,
  Card,
  Modal,
  Tooltip,
  ActionIcon,
  Anchor,
  NavLink,
  Tabs,
  Menu,
  Table,
} from "@mantine/core";

const bodyRoot = {
  root: {
    fontFamily: "var(--body)",
  },
};

export const theme = createTheme({
  fontFamily: "var(--body)",

  headings: {
    fontFamily: "var(--display)",
  },

  components: {
    Title: Title.extend({
      styles: {
        root: { fontFamily: "var(--display)" },
      },
    }),

    Text: Text.extend({ styles: bodyRoot }),
    Button: Button.extend({ styles: bodyRoot }),
    Badge: Badge.extend({ styles: bodyRoot }),

    TextInput: TextInput.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
        description: { fontFamily: "var(--body)" },
        error: { fontFamily: "var(--body)" },
      },
    }),

    Textarea: Textarea.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
        description: { fontFamily: "var(--body)" },
        error: { fontFamily: "var(--body)" },
      },
    }),

    PasswordInput: PasswordInput.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
        innerInput: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
      },
    }),

    NumberInput: NumberInput.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
      },
    }),

    Select: Select.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
        option: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
      },
    }),

    MultiSelect: MultiSelect.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
        option: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
        pill: { fontFamily: "var(--body)" },
      },
    }),

    Checkbox: Checkbox.extend({
      styles: {
        label: { fontFamily: "var(--body)" },
        description: { fontFamily: "var(--body)" },
      },
    }),

    Radio: Radio.extend({
      styles: {
        label: { fontFamily: "var(--body)" },
        description: { fontFamily: "var(--body)" },
      },
    }),

    Switch: Switch.extend({
      styles: {
        label: { fontFamily: "var(--body)" },
        description: { fontFamily: "var(--body)" },
      },
    }),

    Input: Input.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
      },
    }),

    Autocomplete: Autocomplete.extend({
      styles: {
        input: { fontFamily: "var(--body)" },
        option: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
      },
    }),

    Card: Card.extend({
      styles: {
        root: { fontFamily: "var(--body)" },
      },
    }),

    Modal: Modal.extend({
      styles: {
        title: { fontFamily: "var(--display)" },
        body: { fontFamily: "var(--body)" },
      },
    }),

    Tooltip: Tooltip.extend({
      styles: {
        tooltip: { fontFamily: "var(--body)" },
      },
    }),

    ActionIcon: ActionIcon.extend({
      styles: {
        root: { fontFamily: "var(--body)" },
      },
    }),

    Anchor: Anchor.extend({ styles: bodyRoot }),
    NavLink: NavLink.extend({ styles: bodyRoot }),
    Tabs: Tabs.extend({ styles: bodyRoot }),

    Menu: Menu.extend({
      styles: {
        item: { fontFamily: "var(--body)" },
        label: { fontFamily: "var(--body)" },
        dropdown: { fontFamily: "var(--body)" },
      },
    }),

    Table: Table.extend({
      styles: {
        table: { fontFamily: "var(--body)" },
        th: { fontFamily: "var(--body)" },
        td: { fontFamily: "var(--body)" },
      },
    }),
  },
});
