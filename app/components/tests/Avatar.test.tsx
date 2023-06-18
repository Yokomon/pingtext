import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { Avatar } from "../Avatar";

const mockUser1: User = {
  id: Math.random().toString(),
  name: "Alan turing",
  email: "alanturing@mail.co.uk",
  emailVerified: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  hashedPassword: bcrypt.hashSync("hashedPassword", 12),
  image: "https://source.unsplash.com/random/900x700/?fruit",
  conversationsIds: [],
  friendsIds: [],
  receivedPingsIds: [],
};

const mockUser2: User = {
  id: Math.random().toString(),
  name: "Alan turing",
  email: "alanturing@mail.co.uk",
  emailVerified: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  hashedPassword: bcrypt.hashSync("hashedPassword", 12),
  image: null,
  conversationsIds: [],
  friendsIds: [],
  receivedPingsIds: [],
};

describe("Avatar component spec", () => {
  test("Avatar renders user picture when available", () => {
    render(<Avatar currentUser={mockUser1} />);

    const Image = screen.getByRole("img", { name: "avatar" });

    expect(Image).toBeInTheDocument();
  });

  test("Avatar should render initials if image is not available", () => {
    render(<Avatar currentUser={mockUser2} />);

    const firstInitials = screen.getByText(/a/i);
    const lastInitials = screen.getByText(/t/i);

    expect(firstInitials).toBeInTheDocument();
    expect(lastInitials).toBeInTheDocument();
  });
});
