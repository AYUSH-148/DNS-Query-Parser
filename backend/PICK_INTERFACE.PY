import scapy.all as scapy

def main():
    print("Available network interfaces and their IP addresses:\n")
    for iface in scapy.get_if_list():
        try:
            ip_addr = scapy.get_if_addr(iface)
            print(f"{iface:50}  IP: {ip_addr}")
        except Exception:
            print(f"{iface:50}  IP: (No IP assigned or not active)")

    print("\nTo pick the correct interface for DNS capture:")
    print("- Find the one with your active IP address (e.g., from 'ipconfig' or 'ifconfig').")
    print("- Use that interface in your /api/capture call.")

if __name__ == "__main__":
    main()