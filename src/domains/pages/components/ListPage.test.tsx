import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ListPage } from './ListPage';

interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  site: string;
}

const DEVICES: readonly Device[] = [
  { id: 'dev-1', name: 'North Gate Reader', status: 'online', site: 'HQ' },
  { id: 'dev-2', name: 'Server Door Sensor', status: 'offline', site: 'DC' },
  { id: 'dev-3', name: 'Lobby Camera', status: 'online', site: 'HQ' },
];

const COLUMNS = [
  { key: 'name', header: 'Device' },
  { key: 'status', header: 'Status' },
];

function mount(props: Partial<Parameters<typeof ListPage<Device>>[0]> = {}) {
  return render(
    <MemoryRouter>
      <ListPage<Device>
        title="Devices"
        description="Field hardware"
        data={DEVICES}
        getRowId={(row) => row.id}
        columns={COLUMNS}
        {...props}
      />
    </MemoryRouter>,
  );
}

describe('ListPage', () => {
  it('renders header and every row', () => {
    mount();
    expect(screen.getByText('Devices')).toBeDefined();
    expect(screen.getByText('North Gate Reader')).toBeDefined();
    expect(screen.getByText('Server Door Sensor')).toBeDefined();
    expect(screen.getByText('Lobby Camera')).toBeDefined();
  });

  it('filters rows by search terms', () => {
    mount({
      search: { terms: (row) => [row.name, row.site] },
    });
    const input = screen.getByPlaceholderText('Search…');
    fireEvent.change(input, { target: { value: 'camera' } });
    expect(screen.getByText('Lobby Camera')).toBeDefined();
    expect(screen.queryByText('North Gate Reader')).toBeNull();
  });

  it('filters rows by select default matcher and custom matcher', () => {
    mount({
      filters: [{ id: 'status', label: 'Status', options: [{ value: 'online', label: 'Online' }] }],
    });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'online' } });
    expect(screen.queryByText('Server Door Sensor')).toBeNull();
    expect(screen.getByText('Lobby Camera')).toBeDefined();
  });

  it('shows the count of shown vs total', () => {
    mount({
      search: { terms: (row) => row.name },
    });
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'gate' } });
    expect(screen.getByTestId('list-page-count').textContent).toBe('1 of 3');
  });

  it('renders first column as a link via rowLink', () => {
    mount({ rowLink: (row) => `/devices/${row.id}` });
    const link = screen.getByText('Lobby Camera').closest('a');
    expect(link?.getAttribute('href')).toBe('/devices/dev-3');
  });

  it('renders custom cells and per-row actions', () => {
    mount({
      columns: [
        { key: 'name', header: 'Device', render: (row) => `${row.name}!` },
        { key: 'status', header: 'Status', render: (row) => <em>{row.status}</em> },
      ],
      rowActions: (row) => <button type="button">open-{row.id}</button>,
    });
    expect(screen.getByText('Lobby Camera!')).toBeDefined();
    expect(screen.getAllByText('online', { selector: 'em' }).length).toBe(2);
    expect(screen.getByText('open-dev-3')).toBeDefined();
  });

  it('shows the empty state when no row matches', () => {
    mount({
      search: { terms: (row) => row.name },
      empty: { title: 'No devices', description: 'Try another search' },
    });
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'zzz' } });
    expect(screen.getByText('No devices')).toBeDefined();
    expect(screen.getByText('Try another search')).toBeDefined();
    expect(screen.queryByText('Lobby Camera')).toBeNull();
  });

  it('renders skeleton rows while loading an empty dataset', () => {
    const { container } = mount({ data: [], loading: true, empty: { title: 'No devices' } });
    expect(screen.queryByText('No devices')).toBeNull();
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('honours label overrides', () => {
    mount({
      search: { terms: (row) => row.name },
      labels: { searchPlaceholder: 'Cihaz ara', countShown: () => 'üç' },
    });
    expect(screen.getByPlaceholderText('Cihaz ara')).toBeDefined();
    expect(screen.getByTestId('list-page-count').textContent).toBe('üç');
  });

  it('fires the empty action onClick', () => {
    const onClick = vi.fn();
    mount({
      data: [],
      empty: { title: 'No devices', action: { label: 'Add device', onClick } },
    });
    fireEvent.click(screen.getByText('Add device'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
